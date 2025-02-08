import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckConditionsDto, RunConditionDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { BPMNCondition, BPMNNodeCondition } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ConditionTypeEnum } from '../condition-type';
import { QueryTypes, Sequelize } from 'sequelize';

@Injectable()
export class ConditionService {
  constructor(
    @InjectModel(BPMNCondition)
    private readonly conditionRepository: typeof BPMNCondition,
    @InjectModel(BPMNNodeCondition)
    private readonly nodeConditionRepository: typeof BPMNNodeCondition,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async checkConditions(dto: CheckConditionsDto): Promise<boolean> {
    let conditionResult = true;
    // find all conditions of current node
    const nodeConditions = await this.nodeConditionRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: BPMNCondition,
            as: 'condition',
            required: true,
          },
        ])
        .filter({ nodeId: dto.node.id })
        .build(),
    );

    // get only condition
    const conditions = nodeConditions.map(
      (nodeCondition) => nodeCondition.condition,
    );

    // check all conditions passed
    for (const condition of conditions) {
      const result = await this.runCondition({
        condition: condition,
        node: dto.node,
        request: dto.request,
        requestState: dto.requestState,
        transaction: dto.transaction,
      });
      if (!result) {
        conditionResult = false;
        break;
      }
    }
    return conditionResult;
  }

  private async runCondition(dto: RunConditionDto): Promise<boolean> {
    const conditionStrategies = {
      [ConditionTypeEnum.SQL_CONDITION]: () =>
        this.getResultOfSqlCondition(dto),
      [ConditionTypeEnum.SOURCE_CONDITION]: () =>
        this.getResultOfSourceCondition(dto),
    };
    const strategy = conditionStrategies[dto.condition.conditionTypeId];
    return await strategy();
  }

  private async getResultOfSqlCondition(
    dto: RunConditionDto,
  ): Promise<boolean> {
    if (!dto.condition.conditionText)
      throw new BadRequestException('Invalid Condition');
    const text = await this.replaceConventionalParameters(dto);
    const queryResult = await this.sequelize.query(text, {
      type: QueryTypes.RAW,
      transaction: dto.transaction,
      plain: true,
    });

    if (
      queryResult[0][0]['result'] != null &&
      queryResult[0][0]['result'] == '1'
    )
      return true;
    return false;
  }

  private async getResultOfSourceCondition(
    dto: RunConditionDto,
  ): Promise<boolean> {
    return true;
  }

  private async replaceConventionalParameters(
    dto: RunConditionDto,
  ): Promise<string> {
    let text = dto.condition.conditionText;
    text = text.replaceAll('@RequestId', dto.request.id.toString());
    text = text.replaceAll(
      '@OrganizationId',
      dto.request.organizationId?.toString(),
    );
    text = text.replaceAll('@RequestStateId', dto.requestState.id.toString());
    return text;
  }
}

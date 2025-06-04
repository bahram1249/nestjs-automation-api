import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BPMNAction,
  BPMNInboundAction,
  BPMNOutboundAction,
} from '@rahino/localdatabase/models';
import {
  RunActionDto,
  RunInboundActionsDto,
  RunOutboundActionsDto,
  RunSourceActionDto,
  RunSQLActionDto,
} from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { ActionTypeEnum } from '../action-type';
import { ActionLoaderService } from '../action-loader';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(BPMNAction)
    private readonly actionRepository: typeof BPMNAction,
    @InjectModel(BPMNInboundAction)
    private readonly inboundActionRepository: typeof BPMNInboundAction,
    @InjectModel(BPMNOutboundAction)
    private readonly outboundActionRepository: typeof BPMNOutboundAction,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly actionLoaderService: ActionLoaderService,
  ) {}

  async runInboundActions(dto: RunInboundActionsDto) {
    const inboundActions = await this.inboundActionRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ activityId: dto.node.toActivityId })
        .build(),
    );

    for (const inboundAction of inboundActions) {
      await this.runAction({
        actionId: inboundAction.actionId,
        node: dto.node,
        request: dto.request,
        requestState: dto.requestState,
        transaction: dto.transaction,
        userExecuterId: dto.userExecuterId,
      });
    }
  }

  async runOutboundActions(dto: RunOutboundActionsDto) {
    const outboundActions = await this.outboundActionRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ activityId: dto.node.fromActivityId })
        .build(),
    );

    for (const outboundAction of outboundActions) {
      await this.runAction({
        actionId: outboundAction.actionId,
        node: dto.node,
        request: dto.request,
        requestState: dto.requestState,
        transaction: dto.transaction,
        userExecuterId: dto.userExecuterId,
      });
    }
  }

  async runAction(dto: RunActionDto) {
    const action = await this.actionRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.actionId }).build(),
    );

    if (!action) {
      throw new NotFoundException(
        [this.i18n.t('bpmn.action'), this.i18n.t('core.not_found')].join(' '),
      );
    }

    const actionStrategies = {
      [ActionTypeEnum.SQLAction]: () =>
        this.runSQLAction({
          action: action,
          request: dto.request,
          requestState: dto.requestState,
          node: dto.node,
          transaction: dto.transaction,
          userExecuterId: dto.userExecuterId,
        }),
      [ActionTypeEnum.SourceAction]: () =>
        this.runSourceAction({
          action: action,
          request: dto.request,
          requestState: dto.requestState,
          node: dto.node,
          transaction: dto.transaction,
          userExecuterId: dto.userExecuterId,
        }),
    };
    const executeAction = actionStrategies[action.actionTypeId];
    if (!executeAction) throw new BadRequestException('Invalid Action');
    return await executeAction();
  }

  private async runSQLAction(dto: RunSQLActionDto) {
    if (!dto.action.actionText)
      throw new BadRequestException('Invalid Sql Action');
    const query = await this.replaceConventionalParameters(dto);
    await this.sequelize.query(query, {
      type: QueryTypes.RAW,
      transaction: dto.transaction,
    });
  }

  private async runSourceAction(dto: RunSourceActionDto) {
    await this.actionLoaderService.tryExecuteAction({
      source: dto.action.actionSource,
      sourceExecuteAction: {
        node: dto.node,
        request: dto.request,
        requestState: dto.requestState,
        transaction: dto.transaction,
        userExecuterId: dto.userExecuterId,
      },
    });
  }

  private async replaceConventionalParameters(
    dto: RunSQLActionDto,
  ): Promise<string> {
    let text = dto.action.actionText;
    text = text.replaceAll('@RequestId', dto.request.id.toString());
    text = text.replaceAll(
      '@OrganizationId',
      dto.request.organizationId?.toString(),
    );
    text = text.replaceAll('@RequestStateId', dto.requestState.id.toString());
    return text;
  }
}

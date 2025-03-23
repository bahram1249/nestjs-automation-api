import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickOrganizationDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { BPMNRequest, GSRequest } from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class PickOrganizationService {
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
    @InjectModel(BPMNRequest)
    private readonly bpmnRequestRepository: typeof BPMNRequest,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
  ) {}

  async traverse(user: User, dto: PickOrganizationDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      // find guarantee request and update organization id
      let guaranteeRequest = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.requestId })
          .filter(
            Sequelize.where(
              Sequelize.fn('fn', Sequelize.col('GSRequest.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      guaranteeRequest.organizationId = dto.organizationId;
      guaranteeRequest = await guaranteeRequest.save({ transaction });

      // find bpmn request and update organization id
      let bpmnRequest = await this.bpmnRequestRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.requestId })
          .transaction(transaction)
          .build(),
      );
      bpmnRequest.organizationId = dto.organizationId;
      bpmnRequest = await bpmnRequest.save({ transaction });

      // lets traverse request
      await this.traverseService.traverse({
        request: bpmnRequest,
        requestState: cartableItem.requestState,
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        transaction: transaction,
        description: dto.description,
      });

      // apply changes
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}

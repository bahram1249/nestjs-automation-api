import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { RevertRequestDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { BPMNRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { BPMNRequestService } from '@rahino/bpmn/modules/request/request.service';

@Injectable()
export class RevertRequestService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(BPMNRequest)
    private readonly requestRepository: typeof BPMNRequest,
    private readonly requestService: BPMNRequestService,
  ) {}

  async traverse(user: User, dto: RevertRequestDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.requestId }).build(),
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      await this.requestService.revertRequestToInit(
        user.id,
        request,
        transaction,
      ); // apply changes
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}

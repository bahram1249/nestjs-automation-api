import { LocalizationService } from 'apps/main/src/common/localization';
import * as _ from 'lodash';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { BPMNRequest, BPMNRequestState } from '@rahino/localdatabase/models';
import { RequestStateIdDto, RunAutoTraverseDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { BadRequestException } from '@nestjs/common';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { User } from '@rahino/database';
import { Sequelize, Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export class CartableAutoTraverseService {
  constructor(
    private readonly localizationService: LocalizationService,
    @InjectModel(BPMNRequest)
    private readonly requestRepository: typeof BPMNRequest,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    private readonly traverseService: TraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async autoTraverse(user: User, dto: RequestStateIdDto) {
    const requestState = await this.requestStateRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.requestStateId }).build(),
    );
    if (!requestState) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder().filter({ id: requestState.requestId }).build(),
    );
    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    return await this.runAutoTraverse(user, {
      request: request,
      requestState,
      description: dto.description,
    });
  }

  async runAutoTraverse(user: User, dto: RunAutoTraverseDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      await this.traverseService.autoTraverse({
        request: dto.request,
        requestState: dto.requestState,
        description: dto.description,
        userExecuterId: user.id,
        executeBundle: uuidv4(),
        transaction: transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      JSON.stringify(error);
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}

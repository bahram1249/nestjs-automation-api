import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  BPMNPROCESS,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { InitRequestDto } from '@rahino/bpmn/modules/request/dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../../../../main/src/generated/i18n.generated';
import { Sequelize, Transaction } from 'sequelize';
import { RequestStateService } from '../request-state';
import { TraverseService } from '../traverse/traverse.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BPMNRequestService {
  constructor(
    @InjectModel(BPMNRequest)
    private readonly requestRepository: typeof BPMNRequest,
    @InjectModel(BPMNPROCESS)
    private readonly processRepository: typeof BPMNPROCESS,
    @InjectModel(BPMNOrganization)
    private readonly organizationRepository: typeof BPMNOrganization,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    private readonly traverseService: TraverseService,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly requestStateService: RequestStateService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async initRequest(
    dto: InitRequestDto,
    transaction?: Transaction,
  ): Promise<BPMNRequest> {
    await this.checkRequiredValidation(dto);
    await this.checkOptionalValidation(dto);
    return await this.createRequest(dto, transaction);
  }

  private async checkRequiredValidation(dto: InitRequestDto) {
    const process = await this.processRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.processId }).build(),
    );
    if (!process) {
      throw new BadRequestException(
        [
          this.i18n.t('bpmn.process', {
            lang: I18nContext.current().lang,
          }),
          this.i18n.t('core.not_found', {
            lang: I18nContext.current().lang,
          }),
        ].join(' '),
      );
    }

    const user = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.userId }).build(),
    );
    if (!user) {
      throw new BadRequestException(
        [
          this.i18n.t('core.user', {
            lang: I18nContext.current().lang,
          }),
          this.i18n.t('core.not_found', {
            lang: I18nContext.current().lang,
          }),
        ].join(' '),
      );
    }
  }

  private async checkOptionalValidation(dto: InitRequestDto) {
    if (dto.organizationId) {
      const organization = await this.organizationRepository.findOne(
        new QueryOptionsBuilder().filter({ id: dto.organizationId }).build(),
      );
      if (!organization) {
        throw new BadRequestException(
          [
            this.i18n.t('bpmn.organization', {
              lang: I18nContext.current().lang,
            }),
            this.i18n.t('core.not_found', {
              lang: I18nContext.current().lang,
            }),
          ].join(''),
        );
      }
    }
  }

  private async createRequest(
    dto: InitRequestDto,
    transaction?: Transaction,
  ): Promise<BPMNRequest> {
    let request: BPMNRequest;
    try {
      // create request
      request = await this.requestRepository.create(
        {
          userId: dto.userId,
          organizationId: dto.organizationId,
          processId: dto.processId,
        },
        {
          transaction: transaction,
        },
      );
      // init request state
      const requestState = await this.requestStateService.initRequestState({
        processId: dto.processId,
        request: request,
        transaction: transaction,
      });

      // first traverse
      await this.traverseService.autoTraverse({
        request: request,
        requestState: requestState,
        transaction: transaction,
        description: dto.description,
        userExecuterId: dto.userId,
        executeBundle: uuidv4(),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return request;
  }

  public async revertRequestToInit(
    userId: bigint,
    request: BPMNRequest,
    transaction?: Transaction,
  ) {
    try {
      await this.requestStateRepository.destroy({
        where: {
          requestId: request.id,
        },
        transaction: transaction,
      });

      const requestState = await this.requestStateService.initRequestState({
        processId: request.processId,
        request: request,
        transaction: transaction,
        userId: userId,
      });

      await this.traverseService.autoTraverse({
        request: request,
        requestState: requestState,
        transaction: transaction,
        description: 'بازگشت به عقب',
        userExecuterId: userId,
        executeBundle: uuidv4(),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

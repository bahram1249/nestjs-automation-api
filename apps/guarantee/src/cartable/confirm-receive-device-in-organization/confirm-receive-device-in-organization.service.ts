import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { ConfirmRequestDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSRequestItem } from '@rahino/localdatabase/models';
import { RequestItemTypeEnum } from '@rahino/guarantee/shared/request-item-type';
import { RequestItemDto } from './dto/request-item.dto';

@Injectable()
export class ConfirmReceiveDeviceInOrganizationService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequestItem)
    private readonly requestItemRepository: typeof GSRequestItem,
  ) {}

  async traverse(user: User, dto: ConfirmRequestDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      await this.createRequestItems(
        user,
        cartableItem.request.id,
        dto.items,
        transaction,
      );
      // lets traverse request
      await this.traverseService.traverse({
        request: cartableItem.request,
        requestState: cartableItem.requestState,
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        transaction: transaction,
        description: dto.description,
        userExecuterId: user.id,
      });

      // apply changes
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

  private async createRequestItems(
    user: User,
    requestId: bigint,
    items: RequestItemDto[] | undefined,
    transaction: Transaction,
  ) {
    if (!items?.length) {
      return;
    }

    for (const item of items) {
      await this.requestItemRepository.create(
        {
          requestId,
          title: item.title,
          barcode: item.barcode,
          userId: user.id,
          requestItemTypeId:
            RequestItemTypeEnum.SubmitByOrganizationWhenRecived,
        },
        { transaction },
      );
    }
  }
}

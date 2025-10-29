import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickShipmentWayDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSRequest, GSRequestItem } from '@rahino/localdatabase/models';
import { GuaranteeTraverseService } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.service';
import { RequestItemDto } from './dto/request-item.dto';
import { RequestItemTypeEnum } from '@rahino/guarantee/shared/request-item-type';

@Injectable()
export class PickShipmentWayService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSRequestItem)
    private readonly requestItemRepository: typeof GSRequestItem,
  ) {}

  async traverse(user: User, dto: PickShipmentWayDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // update request
      await this.requestRepository.update(
        {
          cartableShipmentWayId: dto.cartableShipmentWayId,
          cartableShipmentWayTrackingCode: dto.cartableShipmentWayTrackingCode,
        },
        {
          where: {
            id: cartableItem.request.id,
          },
          transaction: transaction,
        },
      );

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
        userExecuterId: user.id,
      });

      // apply changes
      await transaction.commit();
    } catch (error) {
      console.log(error);
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
          requestItemTypeId: RequestItemTypeEnum.SubmitByOrganization,
        },
        { transaction },
      );
    }
  }
}

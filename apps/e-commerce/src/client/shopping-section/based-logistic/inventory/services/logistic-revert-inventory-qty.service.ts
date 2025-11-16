import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECInventory,
  ECPayment,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { LogisticInventoryTrackChangeService } from '@rahino/ecommerce/shared/inventory-track-change/logistic-inventory-track-change.service';
import { inventoryStatusService } from '@rahino/ecommerce/shared/inventory/services/inventory-status.service';
import {
  InventoryTrackChangeStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';

@Injectable()
export class LogisticRevertInventoryQtyService {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECLogisticOrder)
    private readonly logisticOrderRepository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly groupedDetailRepository: typeof ECLogisticOrderGroupedDetail,
    private readonly inventoryTrackChangeService: LogisticInventoryTrackChangeService,
    private readonly inventoryStatusService: inventoryStatusService,
    private readonly l10n: LocalizationService,
  ) {}

  async revertQty(paymentId: bigint, transaction?: Transaction) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter({ paymentTypeId: PaymentTypeEnum.ForOrder })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );
    if (!payment)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.payment_not_found'),
      );
    if (!payment.logisticOrderId)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.logistic_order_id_not_set_on_payment'),
      );

    const groupeds = await this.groupedRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ logisticOrderId: payment.logisticOrderId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECLogisticOrderGrouped.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );

    if (!groupeds.length) return;

    const groupedIds = groupeds.map((g) => g.id as any);
    const details = await this.groupedDetailRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ groupedId: { [Op.in]: groupedIds } })
        .transaction(transaction)
        .build(),
    );

    for (const detail of details) {
      if (!detail.inventoryId || !detail.qty) continue;
      let inventory = await this.inventoryRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detail.inventoryId })
          .transaction(transaction)
          .build(),
      );
      if (!inventory) continue;

      inventory.qty = Number(inventory.qty) + Number(detail.qty);
      if (Number(inventory.qty) > 0) {
        inventory.inventoryStatusId = InventoryStatusEnum.available;
        // do not touch status here; logistic flow uses async status updates
      }
      inventory = await inventory.save({ transaction });

      await this.inventoryTrackChangeService.changeStatus(
        inventory.id,
        InventoryTrackChangeStatusEnum.IncreaseQtyForOrderUnpaidOrder,
        inventory.qty,
        payment.logisticOrderId as any,
        transaction,
      );
      // Update product inventory status
      await this.inventoryStatusService.productInventoryStatusUpdate(
        detail.productId,
      );
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { InventoryStatusEnum } from '../enum';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { PaymentTypeEnum } from '@rahino/ecommerce/util/enum';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { inventoryStatusService } from './inventory-status.service';

@Injectable()
export class RevertInventoryQtyService {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    private readonly inventoryStatusService: inventoryStatusService,
  ) {}

  async revertQty(paymentId: bigint) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter({ paymentTypeId: PaymentTypeEnum.ForOrder })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!payment) {
      throw new InternalServerErrorException('payment not founded!');
    }

    const order = await this.orderRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: ECOrderDetail,
            as: 'details',
          },
        ])
        .filter({ id: payment.orderId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    for (let index = 0; index < order.details.length; index++) {
      const detail = order.details[index];
      let inventory = await this.inventoryRepository.findOne(
        new QueryOptionsBuilder().filter({ id: detail.inventoryId }).build(),
      );

      inventory.qty += detail.qty;
      if (inventory.qty > 0) {
        inventory.inventoryStatusId = InventoryStatusEnum.available;
      }
      inventory = await inventory.save();
      await this.inventoryStatusService.productInventoryStatusUpdate(
        detail.productId,
      );
    }
  }
}

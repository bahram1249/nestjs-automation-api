import { Module } from '@nestjs/common';
import { RevertInventoryQtyService, inventoryStatusService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ECInventory, ECPayment, ECOrder, ECProduct]),
  ],
  providers: [RevertInventoryQtyService, inventoryStatusService],
  exports: [RevertInventoryQtyService],
})
export class RevertInventoryModule {}

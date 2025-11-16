import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VendorInventoryProcessor } from './vendor-inventory.processor';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory, ECProduct } from '@rahino/localdatabase/models';
import { VENDOR_QUEUE } from './constants';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/shared/inventory/constants';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [
    BullModule.registerQueue({
      name: VENDOR_QUEUE,
    }),
    BullModule.registerQueue({
      name: PRODUCT_INVENTORY_STATUS_QUEUE,
    }),
    SequelizeModule.forFeature([ECInventory, ECProduct]),
    DBLoggerModule,
  ],
  providers: [VendorInventoryProcessor],
})
export class VendorInventoryModule {}

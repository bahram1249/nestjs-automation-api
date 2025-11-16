import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VendorInventoryProcessor } from './vendor-inventory.processor';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory, ECProduct } from '@rahino/localdatabase/models';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vendor',
    }),
    SequelizeModule.forFeature([ECInventory, ECProduct]),
  ],
  providers: [VendorInventoryProcessor],
})
export class VendorInventoryModule {}

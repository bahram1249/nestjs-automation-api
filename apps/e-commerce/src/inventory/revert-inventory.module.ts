import { Module } from '@nestjs/common';
import { RevertInventoryQtyService, inventoryStatusService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/database';
import { ECPayment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { ECProduct } from '@rahino/database';
import { InventoryTrackChangeModule } from '../inventory-track-change/inventory-track-change.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECInventory, ECPayment, ECOrder, ECProduct]),
    InventoryTrackChangeModule,
  ],
  providers: [RevertInventoryQtyService, inventoryStatusService],
  exports: [RevertInventoryQtyService],
})
export class RevertInventoryModule {}

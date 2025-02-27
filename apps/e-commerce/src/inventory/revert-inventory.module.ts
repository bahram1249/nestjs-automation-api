import { Module } from '@nestjs/common';
import { RevertInventoryQtyService, inventoryStatusService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
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

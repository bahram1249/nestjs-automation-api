import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/localdatabase/models';
import { InventoryTrackChangeService } from './inventory-track-change.service';
import { ECInventoryHistory } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryHistory, ECInventory])],
  providers: [InventoryTrackChangeService],
  exports: [InventoryTrackChangeService],
})
export class InventoryTrackChangeModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventoryTrackChangeStatus } from '@rahino/database';
import { ECInventory } from '@rahino/database';
import { InventoryTrackChangeService } from './inventory-track-change.service';
import { ECInventoryHistory } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryHistory, ECInventory])],
  providers: [InventoryTrackChangeService],
  exports: [InventoryTrackChangeService],
})
export class InventoryTrackChangeModule {}

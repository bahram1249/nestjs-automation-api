import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventoryTrackChangeStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-track-change-status.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { InventoryTrackChangeService } from './inventory-track-change.service';
import { ECInventoryHistory } from '@rahino/database/models/ecommerce-eav/ec-inventory-history.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryHistory, ECInventory])],
  providers: [InventoryTrackChangeService],
  exports: [InventoryTrackChangeService],
})
export class InventoryTrackChangeModule {}

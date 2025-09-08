import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventory, ECInventoryHistory } from '@rahino/localdatabase/models';
import { LogisticInventoryTrackChangeService } from './logistic-inventory-track-change.service';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryHistory, ECInventory])],
  providers: [LogisticInventoryTrackChangeService],
  exports: [LogisticInventoryTrackChangeService],
})
export class LogisticInventoryTrackChangeModule {}

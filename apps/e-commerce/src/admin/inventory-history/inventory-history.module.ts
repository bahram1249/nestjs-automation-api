import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventoryHistory } from '@rahino/database/models/ecommerce-eav/ec-inventory-history.entity';
import { InventoryHistoryService } from './inventory-history.service';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryHistory])],
  providers: [InventoryHistoryService],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}

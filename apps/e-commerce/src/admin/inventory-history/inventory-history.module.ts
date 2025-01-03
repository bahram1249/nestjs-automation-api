import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventoryHistory } from '@rahino/database';
import { InventoryHistoryService } from './inventory-history.service';
import { InventoryHistoryController } from './inventory-history.controller';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECInventory } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECInventoryHistory,
      ECInventory,
    ]),
  ],
  controllers: [InventoryHistoryController],
  providers: [InventoryHistoryService],
  exports: [InventoryHistoryService],
})
export class InventoryHistoryModule {}

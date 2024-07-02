import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECInventoryHistory } from '@rahino/database/models/ecommerce-eav/ec-inventory-history.entity';
import { InventoryHistoryService } from './inventory-history.service';
import { InventoryHistoryController } from './inventory-history.controller';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';

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

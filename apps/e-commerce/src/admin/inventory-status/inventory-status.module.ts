import { Module } from '@nestjs/common';
import { InventoryStatusService } from './inventory-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { InventoryStatusController } from './inventory-status.controller';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECInventoryStatus])],
  controllers: [InventoryStatusController],
  providers: [InventoryStatusService],
})
export class InventoryStatusModule {}

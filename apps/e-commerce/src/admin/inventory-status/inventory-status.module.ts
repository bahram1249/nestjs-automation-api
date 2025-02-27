import { Module } from '@nestjs/common';
import { InventoryStatusService } from './inventory-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { InventoryStatusController } from './inventory-status.controller';
import { ECInventoryStatus } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECInventoryStatus])],
  controllers: [InventoryStatusController],
  providers: [InventoryStatusService],
})
export class InventoryStatusModule {}

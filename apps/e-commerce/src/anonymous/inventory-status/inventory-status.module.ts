import { Module } from '@nestjs/common';
import { InventoryStatusService } from './inventory-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryStatusController } from './inventory-status.controller';
import { ECInventoryStatus } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECInventoryStatus])],
  controllers: [InventoryStatusController],
  providers: [InventoryStatusService],
})
export class AnonymousInventoryStatusModule {}

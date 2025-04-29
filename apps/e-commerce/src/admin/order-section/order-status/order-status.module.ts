import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { OrderStatusController } from './order-status.controller';
import { ECOrderStatus } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECOrderStatus])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class OrderStatusModule {}

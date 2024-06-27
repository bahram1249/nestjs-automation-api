import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { OrderStatusController } from './order-status.controller';
import { ECOrderStatus } from '@rahino/database/models/ecommerce-eav/ec-order-status.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECOrderStatus])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class OrderStatusModule {}

import { Module } from '@nestjs/common';
import { OrderShipmentWayService } from './order-shipmentway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { OrderShipmentWayController } from './order-shipmentway.controller';
import { ECOrderShipmentWay } from '@rahino/database/models/ecommerce-eav/ec-order-shipmentway.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECOrderShipmentWay])],
  controllers: [OrderShipmentWayController],
  providers: [OrderShipmentWayService],
})
export class OrderShipmentWayModule {}

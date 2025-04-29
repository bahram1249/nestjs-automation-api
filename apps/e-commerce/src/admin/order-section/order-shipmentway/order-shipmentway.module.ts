import { Module } from '@nestjs/common';
import { OrderShipmentWayService } from './order-shipmentway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { OrderShipmentWayController } from './order-shipmentway.controller';
import { ECOrderShipmentWay } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECOrderShipmentWay])],
  controllers: [OrderShipmentWayController],
  providers: [OrderShipmentWayService],
})
export class OrderShipmentWayModule {}

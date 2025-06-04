import { Module } from '@nestjs/common';
import { ShippingWayController } from './shipping-way.controller';
import { ShippingWayService } from './shipping-way.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECShippingWay } from '@rahino/localdatabase/models';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECShippingWay])],
  controllers: [ShippingWayController],
  providers: [ShippingWayService],
})
export class ShippingWayModule {}

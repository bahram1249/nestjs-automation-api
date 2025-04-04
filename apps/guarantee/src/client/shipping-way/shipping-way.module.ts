import { Module } from '@nestjs/common';
import { ShippingWayController } from './shipping-way.controller';
import { ShippingWayService } from './shipping-way.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSShippingWay } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSShippingWay])],
  controllers: [ShippingWayController],
  providers: [ShippingWayService],
})
export class GSClientShippingWayModule {}

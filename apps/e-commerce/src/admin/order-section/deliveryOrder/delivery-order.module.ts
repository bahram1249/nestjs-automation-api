import { Module } from '@nestjs/common';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrderService } from './delivery-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECCourier } from '@rahino/localdatabase/models';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, ECCourier]),
    RoleUtilModule,
    UtilOrderModule,
  ],
  controllers: [DeliveryOrderController],
  providers: [DeliveryOrderService],
})
export class DeliveryOrderModule {}

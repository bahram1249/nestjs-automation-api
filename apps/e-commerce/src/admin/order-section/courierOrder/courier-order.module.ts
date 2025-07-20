import { Module } from '@nestjs/common';
import { CourierOrderController } from './courier-order.controller';
import { CourierOrderService } from './courier-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECCourier } from '@rahino/localdatabase/models';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, ECCourier]),
    UtilOrderModule,
    ECommerceSmsModule,
    UserVendorModule,
  ],
  controllers: [CourierOrderController],
  providers: [CourierOrderService],
})
export class CourierOrderModule {}

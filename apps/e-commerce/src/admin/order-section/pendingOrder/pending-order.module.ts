import { Module } from '@nestjs/common';
import { PendingOrderController } from './pending-order.controller';
import { PendingOrderService } from './pending-order.service';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';

@Module({
  imports: [
    UserVendorModule,
    SequelizeModule.forFeature([User, Permission, ECOrder, ECOrderDetail]),
    UtilOrderModule,
    ECommerceSmsModule,
  ],
  controllers: [PendingOrderController],
  providers: [PendingOrderService],
})
export class PendingOrderModule {}

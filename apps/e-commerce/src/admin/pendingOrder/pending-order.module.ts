import { Module } from '@nestjs/common';
import { PendingOrderController } from './pending-order.controller';
import { PendingOrderService } from './pending-order.service';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';

@Module({
  imports: [
    UserVendorModule,
    SequelizeModule.forFeature([User, Permission, ECOrder, ECOrderDetail]),
    UtilOrderModule,
  ],
  controllers: [PendingOrderController],
  providers: [PendingOrderService],
})
export class PendingOrderModule {}

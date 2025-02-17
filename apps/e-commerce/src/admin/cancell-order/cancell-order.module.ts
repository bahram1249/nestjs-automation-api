import { Module } from '@nestjs/common';
import { CancellOrderController } from './cancell-order.controller';
import { CancellOrderService } from './cancell-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECOrderDetail } from '@rahino/database';
import { SnappayModule } from '@rahino/ecommerce/user/shopping/payment/provider/snappay.module';
import { ECPayment } from '@rahino/database';
import { ECPaymentGateway } from '@rahino/database';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { FinalizedPaymentModule } from '@rahino/ecommerce/user/shopping/payment/util/finalized-payment/finalized-payment.module';
import { ECOrderStatus } from '@rahino/database';
import { ECOrderShipmentWay } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECOrder,
      ECOrderDetail,
      ECPayment,
      ECPaymentGateway,
      ECOrderStatus,
      ECOrderShipmentWay,
    ]),
    SequelizeModule,
    UtilOrderModule,
    SnappayModule,
    RoleUtilModule,
    UserVendorModule,
    FinalizedPaymentModule,
  ],
  controllers: [CancellOrderController],
  providers: [CancellOrderService],
})
export class CancellOrderModule {}

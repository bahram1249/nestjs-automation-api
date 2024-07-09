import { Module } from '@nestjs/common';
import { CancellOrderController } from './cancell-order.controller';
import { CancellOrderService } from './cancell-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { SnappayModule } from '@rahino/ecommerce/user/payment/provider/snappay.module';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { RoleUtilModule } from '@rahino/core/user/role-util/role-util.module';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
import { FinalizedPaymentModule } from '@rahino/ecommerce/user/payment/util/finalized-payment/finalized-payment.module';
import { ECOrderStatus } from '@rahino/database/models/ecommerce-eav/ec-order-status.entity';
import { ECOrderShipmentWay } from '@rahino/database/models/ecommerce-eav/ec-order-shipmentway.entity';

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

import { Module } from '@nestjs/common';
import { DeliveryOrderController } from './delivery-order.controller';
import { DeliveryOrderService } from './delivery-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECCourier } from '@rahino/database/models/ecommerce-eav/ec-courier.entity';
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

import { Module } from '@nestjs/common';
import { CourierOrderController } from './courier-order.controller';
import { CourierOrderService } from './courier-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECCourier } from '@rahino/database/models/ecommerce-eav/ec-courier.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, ECCourier]),
    UtilOrderModule,
  ],
  controllers: [CourierOrderController],
  providers: [CourierOrderService],
})
export class CourierOrderModule {}

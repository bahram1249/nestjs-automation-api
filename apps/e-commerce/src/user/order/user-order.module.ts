import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { UserOrderService } from './user-order.service';
import { UserOrderController } from './user-order.controller';
import { UtilOrderModule } from '@rahino/ecommerce/admin/utilOrder/util-order.module';

@Module({
  imports: [SequelizeModule.forFeature([ECOrder]), UtilOrderModule],
  controllers: [UserOrderController],
  providers: [UserOrderService],
})
export class UserOrderModule {}

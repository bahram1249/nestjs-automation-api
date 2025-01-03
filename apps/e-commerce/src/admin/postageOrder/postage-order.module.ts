import { Module } from '@nestjs/common';
import { PostageOrderController } from './postage-order.controller';
import { PostageOrderService } from './postage-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { UtilOrderModule } from '../utilOrder/util-order.module';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder]),
    UtilOrderModule,
    ECommerceSmsModule,
  ],
  controllers: [PostageOrderController],
  providers: [PostageOrderService],
})
export class PostageOrderModule {}

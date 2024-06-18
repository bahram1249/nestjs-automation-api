import { Module } from '@nestjs/common';
import { PostageOrderController } from './postage-order.controller';
import { PostageOrderService } from './postage-order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
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

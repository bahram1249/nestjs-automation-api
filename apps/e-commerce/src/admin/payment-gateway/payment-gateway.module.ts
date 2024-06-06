import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { PaymentGatewayController } from './payment-gateway.controller';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPaymentGateway])],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
})
export class PaymentGatewayModule {}

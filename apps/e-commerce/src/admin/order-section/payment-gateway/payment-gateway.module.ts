import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PaymentGatewayController } from './payment-gateway.controller';
import { ECPaymentGateway } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPaymentGateway])],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
})
export class PaymentGatewayModule {}

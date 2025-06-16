import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentGatewayController } from './payment-gateway.controller';
import { ECPaymentGateway } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECPaymentGateway])],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
})
export class AnonymousPaymentGatewayModule {}

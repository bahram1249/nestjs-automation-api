import { Module } from '@nestjs/common';
import { OnlinePaymentGatewayService } from './online-payment-gateway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPaymentGateway } from '@rahino/localdatabase/models';
import { OnlinePaymentGatewayController } from './online-payment-gateway.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSPaymentGateway])],
  controllers: [OnlinePaymentGatewayController],
  providers: [OnlinePaymentGatewayService],
  exports: [OnlinePaymentGatewayService],
})
export class GSClientOnlinePaymentGatewayModule {}

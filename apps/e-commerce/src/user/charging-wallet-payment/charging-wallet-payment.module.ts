import { Module } from '@nestjs/common';
import { ChargingWalletPaymentController } from './charging-wallet-payment.controller';
import { ChargingWalletPaymentService } from './charging-wallet-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECPaymentGateway])],
  controllers: [ChargingWalletPaymentController],
  providers: [ChargingWalletPaymentService],
})
export class ChargingWalletPaymentModule {}

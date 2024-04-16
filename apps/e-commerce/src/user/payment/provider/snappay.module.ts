import { Module } from '@nestjs/common';
import { SnapPayService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder])],
  providers: [SnapPayService],
  exports: [SnapPayService],
})
export class SnappayModule {}

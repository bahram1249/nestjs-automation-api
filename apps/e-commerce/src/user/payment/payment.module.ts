import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentServiceProviderModule } from './provider/payment-provider.module';
import { ShipmentModule } from '../stock/services/shipment-price';
import { StockModule } from '../stock/stock.module';
import { AddressModule } from '../address/address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([
      ECProvince,
      ECVariationPrice,
      ECPaymentGateway,
      ECOrder,
      ECOrderDetail,
      ECStock,
    ]),
    PaymentServiceProviderModule,
    SequelizeModule,
    ShipmentModule.register({ token: 'SHIPMENT_SERVICE' }),
    StockModule,
    AddressModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

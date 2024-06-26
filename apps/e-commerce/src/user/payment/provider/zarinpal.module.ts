import { Module } from '@nestjs/common';
import { SnapPayService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { RevertInventoryModule } from '@rahino/ecommerce/inventory/revert-inventory.module';
import { FinalizedPaymentModule } from '../util/finalized-payment/finalized-payment.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder]),
    RevertInventoryModule,
    FinalizedPaymentModule,
  ],
  providers: [ZarinPalService],
  exports: [ZarinPalService],
})
export class ZarinPalModule {}

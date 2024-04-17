import { Module } from '@nestjs/common';
import { SnapPayService, ZarinPalService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPaymentGateway, ECPayment, ECOrder]),
    InventoryModule,
  ],
  providers: [ZarinPalService],
  exports: [ZarinPalService],
})
export class ZarinPalModule {}

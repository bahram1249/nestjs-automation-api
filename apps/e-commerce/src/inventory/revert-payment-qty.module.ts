import { Module } from '@nestjs/common';
import { RevertPaymentQtyService } from './services/revert-payment-qty.service';
import { RevertInventoryModule } from './revert-inventory.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';

@Module({
  imports: [
    RevertInventoryModule,
    SequelizeModule.forFeature([ECPayment, ECWallet]),
  ],
  providers: [RevertPaymentQtyService],
  exports: [RevertPaymentQtyService],
})
export class RevertPaymentQtyModule {}

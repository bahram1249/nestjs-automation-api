import { Module } from '@nestjs/common';
import { RevertPaymentQtyService } from './services/revert-payment-qty.service';
import { RevertInventoryModule } from './revert-inventory.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/database';
import { ECWallet } from '@rahino/database';

@Module({
  imports: [
    RevertInventoryModule,
    SequelizeModule.forFeature([ECPayment, ECWallet]),
  ],
  providers: [RevertPaymentQtyService],
  exports: [RevertPaymentQtyService],
})
export class RevertPaymentQtyModule {}

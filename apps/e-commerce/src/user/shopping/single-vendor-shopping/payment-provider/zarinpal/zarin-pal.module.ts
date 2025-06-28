import { Module } from '@nestjs/common';
import { SingleVendorZarinPalService } from './zarin-pal.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment, ECPaymentGateway } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECPayment, ECPaymentGateway])],
  providers: [SingleVendorZarinPalService],
  exports: [SingleVendorZarinPalService],
})
export class SingleVendorZarinPalModule {}

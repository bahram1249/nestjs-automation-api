import { Module } from '@nestjs/common';
import { ValidateAddressService } from './services/validate-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';
import { AddressModule } from '../../address/address.module';

@Module({
  imports: [SequelizeModule.forFeature([ECProvince]), AddressModule],
  providers: [ValidateAddressService],
  exports: [ValidateAddressService],
})
export class PaymentRuleModule {}

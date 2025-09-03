import { Module } from '@nestjs/common';
import { ClientValidateAddressService } from './client-validate-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([ECProvince]), LocalizationModule],
  providers: [ClientValidateAddressService],
  exports: [ClientValidateAddressService],
})
export class ClientValidateAddressModule {}

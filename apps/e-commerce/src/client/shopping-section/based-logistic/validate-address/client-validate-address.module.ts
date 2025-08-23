import { Module } from '@nestjs/common';
import { ClientValidateAddressService } from './client-validate-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECProvince])],
  providers: [ClientValidateAddressService],
  exports: [ClientValidateAddressService],
})
export class ClientValidateAddressModule {}

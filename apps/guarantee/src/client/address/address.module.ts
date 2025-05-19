import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import {
  GSAddress,
  GSCity,
  GSNeighborhood,
  GSProvince,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([GSAddress, GSProvince, GSCity, GSNeighborhood]),
    LocalizationModule,
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
  exports: [AddressService],
})
export class GSAddressModule {}

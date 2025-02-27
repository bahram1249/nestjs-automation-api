import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import {
  ECAddress,
  GSAddress,
  GSCity,
  GSNeighborhood,
  GSProvince,
} from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSAddress, GSProvince, GSCity, GSNeighborhood]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
  exports: [AddressService],
})
export class GSAddressModule {}

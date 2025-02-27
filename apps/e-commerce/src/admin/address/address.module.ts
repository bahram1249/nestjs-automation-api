import { Module } from '@nestjs/common';
import { AdminAddressController } from './addess.controller';
import { AdminAddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECCity } from '@rahino/localdatabase/models';
import { ECNeighborhood } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECAddress,
      ECProvince,
      ECCity,
      ECNeighborhood,
    ]),
  ],
  controllers: [AdminAddressController],
  providers: [AdminAddressService, AddressProfile],
  exports: [AdminAddressService],
})
export class AdminAddressModule {}

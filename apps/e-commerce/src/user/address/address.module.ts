import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress } from '@rahino/database';
import { ECProvince } from '@rahino/database';
import { ECCity } from '@rahino/database';
import { ECNeighborhood } from '@rahino/database';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([ECAddress, ECProvince, ECCity, ECNeighborhood]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
  exports: [AddressService],
})
export class AddressModule {}

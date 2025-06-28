import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress, ECOrder } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECCity } from '@rahino/localdatabase/models';
import { ECNeighborhood } from '@rahino/localdatabase/models';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([
      ECAddress,
      ECProvince,
      ECCity,
      ECNeighborhood,
      ECOrder,
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
  exports: [AddressService],
})
export class AddressModule {}

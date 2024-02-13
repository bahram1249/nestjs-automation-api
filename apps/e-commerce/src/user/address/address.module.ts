import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ECAddress, ECProvince, ECCity, ECNeighborhood]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
  exports: [AddressService],
})
export class AddressModule {}

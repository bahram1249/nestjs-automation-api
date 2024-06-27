import { Module } from '@nestjs/common';
import { AdminAddressController } from './addess.controller';
import { AdminAddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

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

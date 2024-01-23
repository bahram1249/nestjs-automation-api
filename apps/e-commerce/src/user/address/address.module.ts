import { Module } from '@nestjs/common';
import { AddressController } from './addess.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressProfile } from './mapper';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECAddress])],
  controllers: [AddressController],
  providers: [AddressService, AddressProfile],
})
export class AddressModule {}

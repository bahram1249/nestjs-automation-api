import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECProvince])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}

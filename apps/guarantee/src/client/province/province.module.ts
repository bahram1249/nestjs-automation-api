import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSProvince } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSProvince])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class GSProvinceModule {}

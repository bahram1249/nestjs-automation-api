import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECCity])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}

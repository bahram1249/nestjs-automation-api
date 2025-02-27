import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSCity } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSCity])],
  controllers: [CityController],
  providers: [CityService],
})
export class GSCityModule {}

import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { SessionModule } from '../user/session/session.module';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECCity])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}

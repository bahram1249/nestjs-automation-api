import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetType } from '@rahino/localdatabase/models';
import { BuffetCity } from '@rahino/localdatabase/models';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { BuffetCost } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Buffet,
      BuffetType,
      BuffetCity,
      BuffetReserve,
      BuffetCost,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

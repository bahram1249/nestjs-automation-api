import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database';
import { BuffetType } from '@rahino/database';
import { BuffetCity } from '@rahino/database';
import { BuffetReserve } from '@rahino/database';
import { BuffetCost } from '@rahino/database';

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

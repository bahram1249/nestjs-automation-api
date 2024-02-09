import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCity } from '@rahino/database/models/discount-coffe/city.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';

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

import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [SequelizeModule.forFeature([Buffet])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

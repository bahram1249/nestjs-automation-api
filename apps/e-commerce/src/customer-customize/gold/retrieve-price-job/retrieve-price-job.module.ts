import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { RetrievePricePersianApiService } from './retrieve-price-persian-api.service';
import { RetrievePriceRunnerService } from './retrieve-price-runner.service';

@Module({
  imports: [SequelizeModule.forFeature([Setting])],
  providers: [RetrievePricePersianApiService, RetrievePriceRunnerService],
})
export class RetrievePriceJob {}

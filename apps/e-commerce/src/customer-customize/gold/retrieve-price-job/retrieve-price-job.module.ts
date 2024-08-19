import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { RetrievePricePersianApiService } from './retrieve-price-persian-api.service';
import { RetrievePriceRunnerService } from './retrieve-price-runner.service';
import { QueryFilterModule } from '@rahino/query-filter';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Setting, ECInventory]),
    QueryFilterModule,
  ],
  providers: [RetrievePricePersianApiService, RetrievePriceRunnerService],
})
export class RetrievePriceJobModule {}

import { Module } from '@nestjs/common';
import { EntityTypeSortController } from './entity-type-sort.controller';
import { EntityTypeSortService } from './entity-type-sort.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECEntityTypeSort } from '@rahino/database/models/ecommerce-eav/ec-entityType-sort.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECEntityTypeSort])],
  controllers: [EntityTypeSortController],
  providers: [EntityTypeSortService],
})
export class EntityTypeSortModule {}

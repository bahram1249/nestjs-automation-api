import { Module } from '@nestjs/common';
import { NeighborhoodController } from './neighborhood.controller';
import { NeighborhoodService } from './neighborhood.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECNeighborhood])],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
})
export class NeighborhoodModule {}

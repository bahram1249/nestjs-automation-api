import { Module } from '@nestjs/common';
import { NeighborhoodController } from './neighborhood.controller';
import { NeighborhoodService } from './neighborhood.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSNeighborhood } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSNeighborhood])],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
})
export class GSNeighborhoodModule {}

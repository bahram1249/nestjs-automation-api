import { Module } from '@nestjs/common';
import { NeighborhoodController } from './neighborhood.controller';
import { NeighborhoodService } from './neighborhood.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECNeighborhood } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECNeighborhood])],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
})
export class NeighborhoodModule {}

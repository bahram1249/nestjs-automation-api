import { Module } from '@nestjs/common';
import { DashaboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECWallet } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECProductComment, ECOrder, ECWallet])],
  controllers: [DashaboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

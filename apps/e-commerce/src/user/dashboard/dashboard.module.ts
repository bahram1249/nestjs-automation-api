import { Module } from '@nestjs/common';
import { DashaboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { ECWallet } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([ECProductComment, ECOrder, ECWallet])],
  controllers: [DashaboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

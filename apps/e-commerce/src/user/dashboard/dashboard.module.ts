import { Module } from '@nestjs/common';
import { DashaboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/database/models/ecommerce-eav/ec-product-comment.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECProductComment, ECOrder, ECWallet])],
  controllers: [DashaboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

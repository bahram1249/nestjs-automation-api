import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { AdminPostController } from './admin-post.controller';
import { OrderQueryBuilderModule } from '../order-query-builder/order-query-builder.module';
import { AdminPostService } from './admin-post.service';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    OrderQueryBuilderModule,
  ],
  controllers: [AdminPostController],
  providers: [AdminPostService],
})
export class AdminPostReportModule {}

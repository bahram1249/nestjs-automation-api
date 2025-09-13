import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { BasedAdminPostController } from './admin-post.controller';
import { BasedAdminPostService } from './admin-post.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, PersianDate, ECLogisticOrder, ECLogisticOrderGrouped, ECLogisticOrderGroupedDetail]),
  ],
  controllers: [BasedAdminPostController],
  providers: [BasedAdminPostService],
})
export class BasedAdminPostReportModule {}

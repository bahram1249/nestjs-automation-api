import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrderGrouped } from '@rahino/localdatabase/models';
import { BasedAdminPostController } from './admin-post.controller';
import { BasedAdminPostService } from './admin-post.service';
import { LogisticOrderQueryBuilderModule } from '../order-query-builder/logistic-order-query-builder.module';

@Module({
  imports: [
    LogisticOrderQueryBuilderModule,
    SequelizeModule.forFeature([
      PersianDate,
      ECLogisticOrderGrouped,
      Permission,
      User,
    ]),
  ],
  controllers: [BasedAdminPostController],
  providers: [BasedAdminPostService],
})
export class BasedAdminPostReportModule {}

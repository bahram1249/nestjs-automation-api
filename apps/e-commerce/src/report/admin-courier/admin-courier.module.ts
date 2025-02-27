import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { AdminCourierController } from './admin-courier.controller';
import { OrderQueryBuilderModule } from '../order-query-builder/order-query-builder.module';
import { AdminCourierService } from './admin-courier.service';
import { PersianDate } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    OrderQueryBuilderModule,
  ],
  controllers: [AdminCourierController],
  providers: [AdminCourierService],
})
export class AdminCourierReportModule {}

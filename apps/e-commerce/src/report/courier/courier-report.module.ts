import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { CourierReportController } from './courier-report.controller';
import { ShipmentQueryBuilderModule } from '../shipment-query-builder/shipment-query-builder.module';
import { CourierReportService } from './courier-report.service';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECOrder, PersianDate]),
    ShipmentQueryBuilderModule,
  ],
  controllers: [CourierReportController],
  providers: [CourierReportService],
})
export class CourierReportModule {}

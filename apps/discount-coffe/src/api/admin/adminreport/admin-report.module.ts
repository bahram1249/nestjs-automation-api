import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { AdminReportService } from './admin-report.service';
import { AdminReportController } from './admin-report.controller';
import { VW_BuffetReservers } from '@rahino/database/models/discount-coffe/vw_buffet_reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, VW_BuffetReservers])],
  providers: [AdminReportService],
  controllers: [AdminReportController],
})
export class AdminReportApiModule {}

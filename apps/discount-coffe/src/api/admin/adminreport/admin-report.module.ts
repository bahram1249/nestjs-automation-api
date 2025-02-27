import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { AdminReportService } from './admin-report.service';
import { AdminReportController } from './admin-report.controller';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, VW_BuffetReservers])],
  providers: [AdminReportService],
  controllers: [AdminReportController],
})
export class AdminReportApiModule {}

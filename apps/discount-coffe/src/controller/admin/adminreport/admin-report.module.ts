import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';
import { BuffetReserve } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [AdminReportController],
  providers: [AdminReportService],
})
export class AdminReportModule {}

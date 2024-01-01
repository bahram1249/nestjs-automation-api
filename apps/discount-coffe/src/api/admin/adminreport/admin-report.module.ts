import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { AdminReportService } from './admin-report.service';
import { AdminReportController } from './admin-report.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  providers: [AdminReportService],
  controllers: [AdminReportController],
})
export class ReserveApiModule {}

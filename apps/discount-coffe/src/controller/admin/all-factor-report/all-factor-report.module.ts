import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { AllFactorReportController } from './all-factor-report.controller';
import { AllFactorReportService } from './all-factor-report.service';
import { Buffet } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Buffet])],
  controllers: [AllFactorReportController],
  providers: [AllFactorReportService],
})
export class AllFactorReportModule {}

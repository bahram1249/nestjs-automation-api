import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { AllFactorReportService } from './all-factor-report.service';
import { AllFactorReportController } from './all-factor-report.controller';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, VW_BuffetReservers])],
  providers: [AllFactorReportService],
  controllers: [AllFactorReportController],
})
export class AllFactorReportApiModule {}

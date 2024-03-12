import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { AllFactorReportController } from './all-factor-report.controller';
import { AllFactorReportService } from './all-factor-report.service';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Buffet])],
  controllers: [AllFactorReportController],
  providers: [AllFactorReportService],
})
export class AllFactorReportModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { FactorReportController } from './factor-report.controller';
import { FactorReportService } from './factor-report.service';
import { Buffet } from '@rahino/database';
import { VW_BuffetReservers } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Buffet, VW_BuffetReservers]),
  ],
  controllers: [FactorReportController],
  providers: [FactorReportService],
})
export class FactorReportModule {}

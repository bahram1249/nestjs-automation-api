import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { FactorReportController } from './factor-report.controller';
import { FactorReportService } from './factor-report.service';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { VW_BuffetReservers } from '@rahino/database/models/discount-coffe/vw_buffet_reserve.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Buffet, VW_BuffetReservers]),
  ],
  controllers: [FactorReportController],
  providers: [FactorReportService],
})
export class FactorReportModule {}

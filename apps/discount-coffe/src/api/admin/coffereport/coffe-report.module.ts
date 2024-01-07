import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { CoffeReportService } from './coffe-report.service';
import { CoffeReportController } from './coffe-report.controller';
import { VW_BuffetReservers } from '@rahino/database/models/discount-coffe/vw_buffet_reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, VW_BuffetReservers])],
  providers: [CoffeReportService],
  controllers: [CoffeReportController],
})
export class CoffeReportApiModule {}

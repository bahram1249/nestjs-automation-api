import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { CoffeReportService } from './coffe-report.service';
import { CoffeReportController } from './coffe-report.controller';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, VW_BuffetReservers])],
  providers: [CoffeReportService],
  controllers: [CoffeReportController],
})
export class CoffeReportApiModule {}

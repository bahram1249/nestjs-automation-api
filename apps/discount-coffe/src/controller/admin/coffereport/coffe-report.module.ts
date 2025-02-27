import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { CoffeReportController } from './coffe-report.controller';
import { CoffeReportService } from './coffe-report.service';
import { BuffetReserve } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [CoffeReportController],
  providers: [CoffeReportService],
})
export class CoffeReportModule {}

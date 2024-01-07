import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { CoffeReportController } from './coffe-report.controller';
import { CoffeReportService } from './coffe-report.service';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [CoffeReportController],
  providers: [CoffeReportService],
})
export class CoffeReportModule {}

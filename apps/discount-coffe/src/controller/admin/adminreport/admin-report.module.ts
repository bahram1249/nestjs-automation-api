import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [AdminReportController],
  providers: [AdminReportService],
})
export class ReserveModule {}

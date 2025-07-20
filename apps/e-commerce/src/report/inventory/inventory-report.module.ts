import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECInventory } from '@rahino/localdatabase/models';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';

@Module({
  imports: [
    UserVendorModule,
    SequelizeModule.forFeature([User, Permission, ECInventory]),
  ],
  controllers: [InventoryReportController],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}

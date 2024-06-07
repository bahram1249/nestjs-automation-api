import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';
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

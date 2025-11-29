import { Module } from '@nestjs/common';
import { SupplierReportController } from './supplier-report.controller';
import { SupplierReportService } from './supplier-report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import { LocalizationModule } from 'apps/main/src/common/localization';
import {
  GSSupplierPerson,
  BPMNOrganization,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      GSSupplierPerson,
      BPMNOrganization,
      GSGuaranteeOrganization,
    ]),
    LocalizationModule,
  ],
  controllers: [SupplierReportController],
  providers: [SupplierReportService],
})
export class SupplierReportModule {}

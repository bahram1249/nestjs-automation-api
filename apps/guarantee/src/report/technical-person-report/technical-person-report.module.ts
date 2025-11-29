import { Module } from '@nestjs/common';
import { TechnicalPersonReportController } from './technical-person-report.controller';
import { TechnicalPersonReportService } from './technical-person-report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import { LocalizationModule } from 'apps/main/src/common/localization';
import {
  GSTechnicalPerson,
  BPMNOrganization,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      GSTechnicalPerson,
      BPMNOrganization,
      GSGuaranteeOrganization,
    ]),
    LocalizationModule,
  ],
  controllers: [TechnicalPersonReportController],
  providers: [TechnicalPersonReportService],
})
export class TechnicalPersonReportModule {}

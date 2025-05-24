import { Module } from '@nestjs/common';
import { AnonymousPublicReportService } from './public-report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSGuarantee,
  GSGuaranteeOrganization,
  GSRequest,
} from '@rahino/localdatabase/models';
import { PublicReportController } from './public-report.controller';
import { User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSGuarantee,
      GSGuaranteeOrganization,
      GSRequest,
      User,
    ]),
  ],
  controllers: [PublicReportController],
  providers: [AnonymousPublicReportService],
  exports: [AnonymousPublicReportService],
})
export class AnonymousPublicReportModule {}

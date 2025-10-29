import { Module } from '@nestjs/common';
import { IrangsImportDataService } from './irangs-import-data.service';
import { IrangsImportDataController } from './irangs-import-data.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bullmq';
import { IRANGS_IMPORT_QUEUE } from './constants';
import { IrangsImportDataProcessor } from './irangs-import-data.processor';
import { GSIrangsImportData } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data.entity';
import { GSGuarantee } from '@rahino/localdatabase/models/guarantee/gs-guarantee.entity';
import { GSBrand } from '@rahino/localdatabase/models/guarantee/gs-brand.entity';
import { GSProductType } from '@rahino/localdatabase/models/guarantee/gs-product-type.entity';
import { GSVariant } from '@rahino/localdatabase/models/guarantee/gs-varaint.entity';
import { GSGuaranteePeriod } from '@rahino/localdatabase/models/guarantee/gs-guarantee-period.entity';
import { User } from '@rahino/database';
import { GSIrangsImportDataGuarantees } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data-guarantees.entity';
import { GSIrangsImportStatus } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-status.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSIrangsImportData,
      GSGuarantee,
      GSBrand,
      GSProductType,
      GSVariant,
      GSGuaranteePeriod,
      User,
      GSIrangsImportDataGuarantees,
      GSIrangsImportStatus,
    ]),
    BullModule.registerQueue({
      name: IRANGS_IMPORT_QUEUE,
    }),
  ],
  controllers: [IrangsImportDataController],
  providers: [IrangsImportDataService, IrangsImportDataProcessor],
})
export class IrangsImportDataModule {}

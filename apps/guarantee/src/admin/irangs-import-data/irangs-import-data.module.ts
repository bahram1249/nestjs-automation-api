import { Module } from '@nestjs/common';
import { IrangsImportDataService } from './irangs-import-data.service';
import { IrangsImportDataController } from './irangs-import-data.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bullmq';
import { IRANGS_IMPORT_QUEUE } from './constants';
import { IrangsImportDataProcessor } from './irangs-import-data.processor';
import { Permission, User } from '@rahino/database';
import {
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSIrangsImportData,
  GSIrangsImportDataGuarantees,
  GSIrangsImportStatus,
  GSProductType,
  GSVariant,
} from '@rahino/localdatabase/models';

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
      Permission,
    ]),
    BullModule.registerQueue({
      name: IRANGS_IMPORT_QUEUE,
    }),
  ],
  controllers: [IrangsImportDataController],
  providers: [IrangsImportDataService, IrangsImportDataProcessor],
})
export class IrangsImportDataModule {}

import { Module } from '@nestjs/common';
import { CartableWarrantyServiceTypeService } from './warranty-service-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest, GSWarrantyServiceType } from '@rahino/localdatabase/models';
import { CartableWarrantyServiceTypeController } from './warranty-service-type.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSWarrantyServiceType, GSRequest]),
    LocalizationModule,
  ],
  controllers: [CartableWarrantyServiceTypeController],
  providers: [CartableWarrantyServiceTypeService],
  exports: [CartableWarrantyServiceTypeService],
})
export class CartableWarrantyServiceTypeModule {}

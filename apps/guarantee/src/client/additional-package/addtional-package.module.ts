import { Module } from '@nestjs/common';
import { AdditionalPackageService } from './additional-package.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAdditionalPackage } from '@rahino/localdatabase/models';
import { AdditionalPackageController } from './additional-package.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSAdditionalPackage])],
  controllers: [AdditionalPackageController],
  providers: [AdditionalPackageService],
  exports: [AdditionalPackageService],
})
export class GSClientAdditionalPackageModule {}

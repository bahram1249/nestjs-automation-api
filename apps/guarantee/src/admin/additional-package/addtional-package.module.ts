import { Module } from '@nestjs/common';
import { AdditionalPackageService } from './additional-package.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAdditionalPackage } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { AdditionalPackageController } from './additional-package.controller';
import { AdditionalPackageProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([GSAdditionalPackage, User, Permission]),
  ],
  controllers: [AdditionalPackageController],
  providers: [AdditionalPackageService, AdditionalPackageProfile],
  exports: [AdditionalPackageService],
})
export class GSAdditionalPackageModule {}

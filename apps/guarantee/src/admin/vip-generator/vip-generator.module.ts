import { Module } from '@nestjs/common';
import { VipGeneratorService } from './vip-generator.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSVipBundleType, GSVipGenerator } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { VipGeneratorController } from './vip-generator.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSVipBundleType,
      GSVipGenerator,
      User,
      Permission,
    ]),
    LocalizationModule,
  ],
  controllers: [VipGeneratorController],
  providers: [VipGeneratorService],
  exports: [VipGeneratorService],
})
export class GSVipGeneratorModule {}

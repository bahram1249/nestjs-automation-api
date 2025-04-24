import { Module } from '@nestjs/common';
import { VipBundleTypeService } from './vip-bundle-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSVipBundleType } from '@rahino/localdatabase/models';
import { VipBundleTypeController } from './vip-bundle-type.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([GSVipBundleType]), LocalizationModule],
  controllers: [VipBundleTypeController],
  providers: [VipBundleTypeService],
  exports: [VipBundleTypeService],
})
export class GSAnonymousVipBundleTypeModule {}

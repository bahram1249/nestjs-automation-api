import { Module } from '@nestjs/common';
import { VipBundleTypeService } from './vip-bundle-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSVipBundleType } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { VipBundleTypeController } from './vip-bundle-type.controller';
import { VipBundleTypeProfile } from './mapper';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSVipBundleType, User, Permission]),
    LocalizationModule,
  ],
  controllers: [VipBundleTypeController],
  providers: [VipBundleTypeService, VipBundleTypeProfile],
  exports: [VipBundleTypeService],
})
export class GSVipBundleTypeModule {}

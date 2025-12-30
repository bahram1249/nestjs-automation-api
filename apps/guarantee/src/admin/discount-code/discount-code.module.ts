import { Module } from '@nestjs/common';
import { DiscountCodeService } from './discount-code.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSDiscountCode,
  GSUnitPrice,
  GSVipBundleType,
} from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DiscountCodeController } from './discount-code.controller';
import { DiscountCodeProfile } from './mapper';
import { DiscountCodePreviewController } from './discount-code-preview.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSDiscountCode,
      GSUnitPrice,
      Permission,
      User,
      Permission,
    ]),
    LocalizationModule,
  ],
  controllers: [DiscountCodeController, DiscountCodePreviewController],
  providers: [DiscountCodeService, DiscountCodeProfile],
  exports: [DiscountCodeService],
})
export class GSDiscountCodeModule {}

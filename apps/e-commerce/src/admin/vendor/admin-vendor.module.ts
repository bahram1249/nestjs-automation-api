import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { VendorProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import {
  ECCity,
  ECProvince,
  ECVendor,
  ECVendorLogistic,
} from '@rahino/localdatabase/models';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { Role } from '@rahino/database';
import { MinioClientModule } from '@rahino/minio-client';
import { ReverseProxyVendorImageMiddleware } from './reverse-proxy.middleware';
import { Attachment } from '@rahino/database';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from '../../user/session/session.module';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECVendorCommission } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BullModule } from '@nestjs/bullmq';
import { VENDOR_QUEUE } from '../../job/vendor-inventory/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: VENDOR_QUEUE,
    }),
    SessionModule,
    UserRoleModule,
    MinioClientModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      Role,
      ECVendor,
      ECVendorUser,
      Attachment,
      ECVariationPrice,
      ECVendorCommission,
      ECProvince,
      ECCity,
      ECVendorLogistic,
    ]),
    SequelizeModule,
    LocalizationModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        height: parseInt(config.get('VENDOR_IMAGE_HEIGHT')) || 700,
        width: parseInt(config.get('VENDOR_IMAGE_WIDTH')) || 700,
        resizeOptions: {
          withoutEnlargement: true,
          withoutReduction: true,
        },
      }),
    }),
  ],
  controllers: [VendorController],
  providers: [VendorService, VendorProfile],
})
export class AdminVendorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyVendorImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/vendors/image/*',
      method: RequestMethod.GET,
    });
  }
}

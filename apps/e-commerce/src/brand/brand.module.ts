import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BrandProfile } from './mapper';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { ReverseProxyBrandImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from '../user/session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([User, Permission, ECBrand, Attachment]),
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        height: parseInt(config.get('BRAND_IMAGE_HEIGHT')) || 700,
        width: parseInt(config.get('BRAND_IMAGE_WIDTH')) || 700,
        resizeOptions: {
          withoutEnlargement: true,
          withoutReduction: true,
        },
      }),
    }),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandProfile],
})
export class BrandModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyBrandImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/brands/image/*',
      method: RequestMethod.GET,
    });
  }
}

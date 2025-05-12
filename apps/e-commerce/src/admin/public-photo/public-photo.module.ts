import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PublicPhotoController } from './public-photo.controller';
import { PublicPhotoService } from './public-photo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { EAVEntityPhoto } from '@rahino/localdatabase/models';
import { ReverseProxyPublicImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Attachment, EAVEntityPhoto]),
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        resizeOptions: {
          withoutEnlargement: false,
          withoutReduction: true,
          fit: 'fill',
          position: 'center',
        },
      }),
    }),
  ],
  controllers: [PublicPhotoController],
  providers: [PublicPhotoService],
  exports: [PublicPhotoService],
})
export class AdminPublicPhotoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyPublicImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/admin/publicphotos/image/*',
      method: RequestMethod.GET,
    });
  }
}

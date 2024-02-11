import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductPhotoController } from './product-photo.controller';
import { ProductPhotoService } from './product-photo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { EAVEntityPhoto } from '@rahino/database/models/eav/eav-entity-photo.entity';
import { ReverseProxyProductImageMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Attachment, EAVEntityPhoto]),
    MinioClientModule,
  ],
  controllers: [ProductPhotoController],
  providers: [ProductPhotoService],
  exports: [ProductPhotoService],
})
export class ProductPhotoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyProductImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/productphotos/image/*',
      method: RequestMethod.GET,
    });
  }
}

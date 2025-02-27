import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductVideoController } from './product-video.controller';
import { ProductVideoService } from './product-video.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { ReverseProxyProductVideoMiddleware } from './reverse-proxy.middleware';
import { EAVEntityVideo } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Attachment, EAVEntityVideo]),
    MinioClientModule,
  ],
  controllers: [ProductVideoController],
  providers: [ProductVideoService],
  exports: [ProductVideoService],
})
export class ProductVideoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyProductVideoMiddleware).forRoutes({
      path: '/v1/api/ecommerce/productVideos/image/*',
      method: RequestMethod.GET,
    });
  }
}

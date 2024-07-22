import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HomePhotoController } from './home-photo.controller';
import { HomePhotoService } from './home-photo.service';
import { ReverseProxyHomePhotosImageMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [],
  controllers: [HomePhotoController],
  providers: [HomePhotoService],
  exports: [HomePhotoService],
})
export class HomePhotoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyHomePhotosImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/homePhotos/image/*',
      method: RequestMethod.GET,
    });
  }
}

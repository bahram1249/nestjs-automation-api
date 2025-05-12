import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SelectedProductController } from './selected-product.controller';
import { SelectedProductService } from './selected-product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { SelectedProductProfile } from './mapper';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { ReverseProxySelectedProductImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { ECSelectedProduct } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECSelectedProduct,
      Attachment,
    ]),
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        height: parseInt(config.get('SELECTED_PRODUCT_IMAGE_HEIGHT')) || 700,
        width: parseInt(config.get('SELECTED_PRODUCT_IMAGE_WIDTH')) || 700,
        resizeOptions: {
          withoutEnlargement: true,
          withoutReduction: true,
        },
      }),
    }),
  ],
  controllers: [SelectedProductController],
  providers: [SelectedProductService, SelectedProductProfile],
})
export class SelectedProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxySelectedProductImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/admin/selectedProducts/image/*',
      method: RequestMethod.GET,
    });
  }
}

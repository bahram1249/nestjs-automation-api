import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SelectedProductController } from './selected-product.controller';
import { SelectedProductService } from './selected-product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { SelectedProductProfile } from './mapper';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { ReverseProxySelectedProductImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { ECSelectedProduct } from '@rahino/database/models/ecommerce-eav/ec-selected-product.entity';

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

import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProductModule } from './admin/product/product.module';
import { LoginModule } from './user/login/login.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BrandModule } from './brand/brand.module';
import { ColorModule } from './color/color.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuaranteeMonthModule } from './guarantee-month/guarantee-month.module';
import { PublishStatusModule } from './publish-status/publish-status.module';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { AddressModule } from './user/address/address.module';
import { ProductPhotoModule } from './product-photo/product-photo.module';
import { ProductImageRemovalModule } from './product-image-removal/product-image-removal.module';
import { ProductImageRemovalService } from './product-image-removal/product-image-removal.service';
import { VendorModule } from './vendor/vendor.module';
import { UserVendorModule } from './user/vendor/user-vendor.module';
import { VendorAddressModule } from './vendor-address/vendor-address.module';

@Module({
  imports: [
    LoginModule,
    BrandModule,
    ColorModule,
    GuaranteeModule,
    GuaranteeMonthModule,
    PublishStatusModule,
    ProvinceModule,
    CityModule,
    NeighborhoodModule,
    AddressModule,
    ProductPhotoModule,
    ProductImageRemovalModule,
    VendorModule,
    UserVendorModule,
    VendorAddressModule,
    ProductModule,
  ],
})
export class ECommerceModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  async setApp(app: INestApplication<any>) {
    this.app = app;
    const coreConfig = new DocumentBuilder()
      .setTitle('ECommerce Api')
      .setDescription('The ECommerce API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
      include: [ECommerceModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/ecommerce', this.app, coreDocument);

    app.get(ProductImageRemovalService).run();
  }
}

import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductTypeModule } from './admin/product-type';
import { BrandModule } from './admin/brand';
import { NormalGuaranteeModule } from './admin/normal-guarantee';
import { LoginModule } from './client/login/login.module';
import { SellerSyncModule, SellerSyncService } from './job/seller-sync';

@Module({
  imports: [
    LoginModule,
    SellerSyncModule,
    ProductTypeModule,
    BrandModule,
    NormalGuaranteeModule,
  ],
})
export class GSModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  async setApp(app: INestApplication<any>) {
    this.app = app;

    const guaranteeConfig = new DocumentBuilder()
      .setTitle('Guarantee Api')
      .setDescription('The Guarantee API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const guaranteeDocument = SwaggerModule.createDocument(
      this.app,
      guaranteeConfig,
      {
        include: [GSModule],
        deepScanRoutes: true,
      },
    );

    SwaggerModule.setup('api/guarantee', this.app, guaranteeDocument);

    await app.get(SellerSyncService).sync();
  }
}

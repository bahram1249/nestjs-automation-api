import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductTypeModule } from './admin/product-type';

@Module({
  imports: [ProductTypeModule],
})
export class GSModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: INestApplication<any>) {
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
  }
}

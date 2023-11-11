import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AgeModule } from './age/age.module';
import { PeriodTypeModule } from './period-type/period-type.module';
import { PublishModule } from './publish/publish.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [AgeModule, PeriodTypeModule, PublishModule],
  exports: [PCMModule],
})
export class PCMModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: INestApplication<any>) {
    this.app = app;
    const pcmConfig = new DocumentBuilder()
      .setTitle('PCM Api')
      .setDescription('The PCM API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const pcmDocument = SwaggerModule.createDocument(this.app, pcmConfig, {
      include: [PCMModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/pcm', this.app, pcmDocument);
  }
}

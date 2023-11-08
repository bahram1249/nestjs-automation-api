import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { PeriodTypeModule } from '../../api/pcm/period-type/period-type.module';
import { AgeModule } from '../../api/pcm/age/age.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PublishModule } from '../../api/pcm/publish/publish.module';

@Module({
  imports: [PeriodTypeModule, AgeModule, PublishModule],
})
export class PCMRouteModule implements NestModule {
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
      include: [PCMRouteModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/pcm', this.app, pcmDocument);
  }
}

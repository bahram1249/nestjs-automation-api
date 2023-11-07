import { INestApplication, Module } from '@nestjs/common';
import { PeriodTypeModule } from '../../api/pcm/period-type/period-type.module';
import { AgeModule } from '../../api/pcm/age/age.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [PeriodTypeModule, AgeModule],
})
export class PCMRouteModule {
  setApp(app: INestApplication<any>) {
    const pcmConfig = new DocumentBuilder()
      .setTitle('PCM Api')
      .setDescription('The PCM API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const pcmDocument = SwaggerModule.createDocument(app, pcmConfig, {
      include: [PCMRouteModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/pcm', app, pcmDocument);
  }
}

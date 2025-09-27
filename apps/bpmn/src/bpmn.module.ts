import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BPMNRequestModule } from './modules/request/request.module';
import { TestModule } from './test/test.module';
import { DynamicConditionModule } from './dynamic-condition';
import { DynamicActionModule } from './dynamic-action';
import { AdminBpmnModule } from './api-module/admin-bpmn.module';

@Module({
  imports: [
    BPMNRequestModule,
    TestModule,
    DynamicConditionModule,
    DynamicActionModule,
    AdminBpmnModule,
  ], //[RequestModule],
  exports: [BPMNRequestModule],
})
export class BPMNModule implements NestModule {
  constructor() {}
  private app: INestApplication;

  configure(consumer: MiddlewareConsumer) {}

  setApp(app: INestApplication<any>) {
    this.app = app;
    const bpmnConfig = new DocumentBuilder()
      .setTitle('BPMN Api')
      .setDescription('The BPMN API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const bpmnDocument = SwaggerModule.createDocument(this.app, bpmnConfig, {
      include: [BPMNModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/bpmn', this.app, bpmnDocument);
  }
}

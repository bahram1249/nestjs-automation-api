import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestModule } from './modules/request/request.module';
import { TestModule } from './test/test.module';
import { ConditionLoaderModule } from './modules/condition-loader';
import { DynamicConditionModule } from './dynamic-condition';

@Module({
  imports: [RequestModule, TestModule, DynamicConditionModule], //[RequestModule],
  exports: [RequestModule],
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

import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AttributeModule } from './admin/attribute/attribute.module';
import { AttributeTypeModule } from './admin/attribute-type/attribute-type.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityTypeModule } from './admin/entity-type/entity-type.module';
import { EntityModelModule } from './admin/entity-model/entity-model.module';
import { EntityModule } from './admin/entity/entity.module';
import { AttributeValueModule } from './admin/attribute-value/attribute-value.module';
import { BlogPublishModule } from './admin/blog-publish/blog-publish.module';
import { PostModule } from './admin/post/post.module';
import { ClientPostModule } from './client/post';
import { ClientEntityTypeModule } from './client/entity-type/entity-type.module';

@Module({
  imports: [
    AttributeModule,
    AttributeTypeModule,
    AttributeValueModule,
    EntityTypeModule,
    EntityModelModule,
    EntityModule,
    BlogPublishModule,
    PostModule,
    ClientPostModule,
    ClientEntityTypeModule,
  ],
})
export class EAVModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: INestApplication<any>) {
    this.app = app;
    const coreConfig = new DocumentBuilder()
      .setTitle('EAV Api')
      .setDescription('The EAV API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
      include: [EAVModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/eav', this.app, coreDocument);
  }
}

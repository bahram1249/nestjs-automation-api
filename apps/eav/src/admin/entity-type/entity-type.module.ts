import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EntityTypeController } from './entity-type.controller';
import { EntityTypeService } from './entity-type.service';
import { EntityTypeProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { EAVEntityModel } from '@rahino/database';
import { Attachment } from '@rahino/database';
import { MinioClientModule } from '@rahino/minio-client';
import { ReverseProxyEntityTypesImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      EAVEntityType,
      EAVEntityModel,
      Attachment,
    ]),
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        height: parseInt(config.get('ENTITY_TYPE_IMAGE_HEIGHT')) || 700,
        width: parseInt(config.get('ENTITY_TYPE_IMAGE_WIDTH')) || 700,
        resizeOptions: {
          withoutEnlargement: true,
          withoutReduction: true,
        },
      }),
    }),
  ],
  controllers: [EntityTypeController],
  providers: [EntityTypeService, EntityTypeProfile],
  exports: [EntityTypeService],
})
export class EntityTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyEntityTypesImageMiddleware).forRoutes({
      path: '/v1/api/eav/admin/entityTypes/image/*',
      method: RequestMethod.GET,
    });
  }
}

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
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { EAVEntityModel } from '@rahino/database/models/eav/eav-entity-model.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
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
})
export class EntityTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyEntityTypesImageMiddleware).forRoutes({
      path: '/v1/api/eav/admin/entityTypes/image/*',
      method: RequestMethod.GET,
    });
  }
}

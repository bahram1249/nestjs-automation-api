import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  EAVEntityPhoto,
  EAVEntityType,
  EAVPost,
} from '@rahino/localdatabase/models';
import { Attachment, User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PostProfile } from './mapper';
import { EntityModule } from '../entity/entity.module';
import { MinioClientModule } from '@rahino/minio-client';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      EAVPost,
      EAVEntityType,
      Attachment,
      EAVEntityPhoto,
    ]),
    EntityModule,
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        resizeOptions: {
          withoutEnlargement: false,
          withoutReduction: true,
          fit: 'fill',
          position: 'center',
        },
      }),
    }),
  ],
  providers: [PostService, PostProfile],
  controllers: [PostController],
})
export class PostModule {}

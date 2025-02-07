import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntity, EAVEntityType, EAVPost, User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PostProfile } from './mapper';
import { EntityModule } from '../entity/entity.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([User, Permission, EAVPost, EAVEntityType]),
    EntityModule,
  ],
  providers: [PostService, PostProfile],
  controllers: [PostController],
})
export class PostModule {}

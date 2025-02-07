import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVPost, User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PostProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVPost])],
  providers: [PostService, PostProfile],
  controllers: [PostController],
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { BlogPublishService } from './blog-publish.service';
import { BlogPublishController } from './blog-publish.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVBlogPublish } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVBlogPublish])],
  controllers: [BlogPublishController],
  providers: [BlogPublishService],
})
export class BlogPublishModule {}

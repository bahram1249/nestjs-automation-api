import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVPost } from '@rahino/localdatabase/models';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [SequelizeModule.forFeature([EAVPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class ClientPostModule {}

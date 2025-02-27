import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule } from '../session/session.module';
import { ECProductComment } from '@rahino/localdatabase/models';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECProductComment])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class UserCommentModule {}

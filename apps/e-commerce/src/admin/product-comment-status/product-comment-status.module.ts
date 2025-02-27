import { Module } from '@nestjs/common';
import { ProductCommentStatusService } from './product-comment-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ProductCommentStatusController } from './product-comment-status.controller';
import { ECProductCommentStatus } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECProductCommentStatus]),
  ],
  controllers: [ProductCommentStatusController],
  providers: [ProductCommentStatusService],
})
export class ProductCommentStatusModule {}

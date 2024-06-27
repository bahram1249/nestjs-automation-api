import { Module } from '@nestjs/common';
import { ProductCommentStatusService } from './product-comment-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ProductCommentStatusController } from './product-comment-status.controller';
import { ECProductCommentStatus } from '@rahino/database/models/ecommerce-eav/ec-comment-status.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECProductCommentStatus]),
  ],
  controllers: [ProductCommentStatusController],
  providers: [ProductCommentStatusService],
})
export class ProductCommentStatusModule {}

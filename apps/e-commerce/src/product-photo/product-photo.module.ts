import { Module } from '@nestjs/common';
import { ProductPhotoController } from './product-photo.controller';
import { ProductPhotoService } from './product-photo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database/models/core/attachment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Attachment]),
    MinioClientModule,
  ],
  controllers: [ProductPhotoController],
  providers: [ProductPhotoService],
})
export class ProductPhotoModule {}
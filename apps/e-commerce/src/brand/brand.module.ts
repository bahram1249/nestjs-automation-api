import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BrandProfile } from './mapper';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database/models/core/attachment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECBrand, Attachment]),
    MinioClientModule,
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandProfile],
})
export class BrandModule {}

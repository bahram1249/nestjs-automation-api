import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BrandProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECBrand])],
  controllers: [BrandController],
  providers: [BrandService, BrandProfile],
})
export class BrandModule {}

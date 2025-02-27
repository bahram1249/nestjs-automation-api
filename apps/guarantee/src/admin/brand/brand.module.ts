import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSBrand } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { BrandController } from './brand.controller';
import { BrandProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([GSBrand, User, Permission])],
  controllers: [BrandController],
  providers: [BrandService, BrandProfile],
  exports: [BrandService],
})
export class BrandModule {}

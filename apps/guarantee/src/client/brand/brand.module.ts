import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSBrand } from '@rahino/localdatabase/models';
import { BrandController } from './brand.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSBrand])],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class ClientBrandModule {}

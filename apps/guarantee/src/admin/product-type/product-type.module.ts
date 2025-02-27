import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSProductType } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([GSProductType, User, Permission])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, ProductTypeProfile],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}

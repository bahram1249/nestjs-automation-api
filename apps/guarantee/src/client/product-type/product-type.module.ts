import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSProductType } from '@rahino/localdatabase/models';
import { ProductTypeController } from './product-type.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ClientProductTypeModule {}

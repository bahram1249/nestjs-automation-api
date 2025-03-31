import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSVariant } from '@rahino/localdatabase/models';
import { VariantController } from './variant.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSVariant])],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class ClientVariantModule {}

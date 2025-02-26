import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSVariant, Permission, User } from '@rahino/database';
import { VariantController } from './variant.controller';
import { VariantProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([GSVariant, User, Permission])],
  controllers: [VariantController],
  providers: [VariantService, VariantProfile],
  exports: [VariantService],
})
export class VariantModule {}

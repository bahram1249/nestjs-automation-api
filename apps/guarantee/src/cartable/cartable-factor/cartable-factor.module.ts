import { Module } from '@nestjs/common';
import { FactorController } from './cartable-factor.controller';
import { FactorService } from './cartable-factor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';
import { GSSuccessFactorQueryBuilderModule } from '@rahino/guarantee/shared/success-factor-query-builder';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { OrganizationStuffModule } from '@rahino/guarantee/shared/organization-stuff';
import { Permission, User } from '@rahino/database';
import { RoleModule } from '@rahino/core/user/role/role.module';

@Module({
  imports: [
    SequelizeModule.forFeature([GSFactor, User, Permission]),
    GSSuccessFactorQueryBuilderModule,
    LocalizationModule,
    OrganizationStuffModule,
    RoleModule,
  ],
  controllers: [FactorController],
  providers: [FactorService],
  exports: [FactorService],
})
export class GSCartableFactorModule {}

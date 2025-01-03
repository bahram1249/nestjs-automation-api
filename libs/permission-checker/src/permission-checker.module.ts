import { Module } from '@nestjs/common';
import { appGuardProviders } from './provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { CheckPermission } from './decorator';
import { PermissionGuard } from './guard';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [...appGuardProviders],
  exports: [PermissionCheckerModule, CheckPermission, PermissionGuard],
})
export class PermissionCheckerModule {}

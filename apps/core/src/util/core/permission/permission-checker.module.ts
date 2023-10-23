import { Module } from '@nestjs/common';
import { appGuardProviders } from './provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [...appGuardProviders],
  exports: [PermissionCheckerModule],
})
export class PermissionCheckerModule {}

import { Global, Module } from '@nestjs/common';
import { appGuardProviders } from './provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  providers: [...appGuardProviders],
  exports: [
    PermissionCheckerModule,
    SequelizeModule.forFeature([User, Permission]),
  ],
})
export class PermissionCheckerModule {}

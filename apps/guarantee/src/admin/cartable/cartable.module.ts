import { Module } from '@nestjs/common';
import { CartableService } from './cartable.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestState } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { CartableController } from './cartable.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RoleModule } from '@rahino/core/user/role/role.module';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,
    LocalizationModule,
    SequelizeModule.forFeature([BPMNRequestState, User, Permission]),
  ],
  controllers: [CartableController],
  providers: [CartableService],
  exports: [CartableService],
})
export class GSCartableModule {}

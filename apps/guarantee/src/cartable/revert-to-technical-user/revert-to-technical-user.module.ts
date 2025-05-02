import { Module } from '@nestjs/common';
import { RevertToTechnicalUserService } from './revert-to-technical-user.service';
import { RevertToTechnicalUserController } from './revert-to-technical-user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSRequest]),
  ],
  controllers: [RevertToTechnicalUserController],
  providers: [RevertToTechnicalUserService],
  exports: [RevertToTechnicalUserService],
})
export class RevertToTechnicalUserModule {}

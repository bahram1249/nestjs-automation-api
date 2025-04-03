import { Module } from '@nestjs/common';
import { PickTechnicalUserService } from './pick-technical-user.service';
import { PickTechnicalUserController } from './pick-technical-user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [PickTechnicalUserController],
  providers: [PickTechnicalUserService],
  exports: [PickTechnicalUserService],
})
export class PickTechnicalUserModule {}

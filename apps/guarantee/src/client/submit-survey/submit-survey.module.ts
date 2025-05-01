import { Module } from '@nestjs/common';
import { SubmitSurveyService } from './submit-survey.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import {
  GSAnswerRecord,
  GSQuestion,
  GSRequest,
  GSResponse,
} from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.module';
import { SubmitSurveyController } from './submit-survey.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSRequest,
      GSQuestion,
      GSResponse,
      GSAnswerRecord,
    ]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [SubmitSurveyController],
  providers: [SubmitSurveyService],
  exports: [SubmitSurveyService],
})
export class GSClientSubmitSurveyModule {}

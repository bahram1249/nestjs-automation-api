import { Module } from '@nestjs/common';
import { PointInSurveyRequestActionService } from './point-in-survey-request-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPoint, GSUserPoint } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSPoint, GSUserPoint])],
  providers: [
    {
      provide: 'PointInSurveyRequestActionService',
      useClass: PointInSurveyRequestActionService,
    },
  ],
})
export class PointInSurveyRequestActionModule {}

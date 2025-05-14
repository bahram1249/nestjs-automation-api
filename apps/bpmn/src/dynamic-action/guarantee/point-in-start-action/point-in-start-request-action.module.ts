import { Module } from '@nestjs/common';
import { PointInStartRequestActionService } from './point-in-start-request-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPoint, GSUserPoint } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSPoint, GSUserPoint])],
  providers: [
    {
      provide: 'PointInStartRequestActionService',
      useClass: PointInStartRequestActionService,
    },
  ],
})
export class PointInStartRequestActionModule {}

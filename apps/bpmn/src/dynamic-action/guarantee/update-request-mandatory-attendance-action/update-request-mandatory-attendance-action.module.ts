import { Module } from '@nestjs/common';
import { UpdateRequestMandatoryAttendanceActionService } from './update-request-mandatory-attendance-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSRequest])],
  providers: [
    {
      provide: 'UpdateRequestMandatoryAttendanceActionService',
      useClass: UpdateRequestMandatoryAttendanceActionService,
    },
  ],
})
export class UpdateRequestMandatoryAttendanceActionModule {}

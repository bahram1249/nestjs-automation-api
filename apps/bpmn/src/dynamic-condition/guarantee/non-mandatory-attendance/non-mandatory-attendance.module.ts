import { Module } from '@nestjs/common';
import { NonMandatoryAttendanceService } from './non-mandatory-attendance.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSRequest])],
  providers: [
    {
      provide: 'NonMandatoryAttendanceService',
      useClass: NonMandatoryAttendanceService,
    },
  ],
})
export class NonMandatoryAttendanceModule {}

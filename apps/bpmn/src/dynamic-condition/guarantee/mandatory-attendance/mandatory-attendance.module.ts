import { Module } from '@nestjs/common';
import { MandatoryAttendanceService } from './mandatory-attendance.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSRequest])],
  providers: [
    {
      provide: 'MandatoryAttendanceService',
      useClass: MandatoryAttendanceService,
    },
  ],
})
export class MandatoryAttendanceModule {}

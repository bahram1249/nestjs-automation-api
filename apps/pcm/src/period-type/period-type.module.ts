import { Module } from '@nestjs/common';
import { PeriodTypeService } from './period-type.service';
import { PeriodTypeController } from './period-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PCMPeriodType } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMPeriodType])],
  controllers: [PeriodTypeController],
  providers: [PeriodTypeService],
})
export class PeriodTypeModule {}

import { Module } from '@nestjs/common';
import { PeriodTypeService } from './period-type.service';
import { PeriodTypeController } from './period-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { PCMPeriodType } from 'apps/core/src/database/sequelize/models/pcm/pcm-period-type.entity';

@Module({
  imports: [SequelizeModule.forFeature([PCMPeriodType])],
  controllers: [PeriodTypeController],
  providers: [PeriodTypeService],
})
export class PeriodTypeModule {}

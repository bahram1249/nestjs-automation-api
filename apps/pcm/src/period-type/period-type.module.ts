import { Module } from '@nestjs/common';
import { PeriodTypeService } from './period-type.service';
import { PeriodTypeController } from './period-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { PCMPeriodType } from '@rahino/database/models/pcm/pcm-period-type.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMPeriodType])],
  controllers: [PeriodTypeController],
  providers: [PeriodTypeService],
})
export class PeriodTypeModule {}

import { Module } from '@nestjs/common';
import { PeriodTypeModule } from '../../api/pcm/period-type/period-type.module';
import { AgeModule } from '../../api/pcm/age/age.module';

@Module({
  imports: [PeriodTypeModule, AgeModule],
})
export class PCMRouteModule {}

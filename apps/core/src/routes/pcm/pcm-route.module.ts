import { Module } from '@nestjs/common';
import { PeriodTypeModule } from '../../api/pcm/period-type/period-type.module';

@Module({
  imports: [PeriodTypeModule],
})
export class PCMRouteModule {}

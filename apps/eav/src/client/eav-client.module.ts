import { Module } from '@nestjs/common';
import { ClientPostModule } from './post';

@Module({
  imports: [ClientPostModule],
})
export class EAVClientModule {}

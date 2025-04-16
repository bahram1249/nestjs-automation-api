import { Module } from '@nestjs/common';
import { RedirectorController } from './redirector.controller';
import { RedirectorService } from './redirector.service';

@Module({
  imports: [],
  controllers: [RedirectorController],
  providers: [RedirectorService],
})
export class RedirectorModule {}

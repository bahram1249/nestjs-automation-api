import { Module } from '@nestjs/common';
import { DBLogger } from './db-logger.service';

@Module({
  providers: [DBLogger],
  exports: [DBLogger],
})
export class DBLoggerModule {}

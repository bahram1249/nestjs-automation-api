import { Module } from '@nestjs/common';
import { DBLogger } from './db-logger.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonLog } from 'apps/core/src/database/sequelize/models/core/winstonlog.entity';

@Module({
  imports: [SequelizeModule.forFeature([WinstonLog])],
  providers: [DBLogger],
  exports: [DBLogger],
})
export class DBLoggerModule {}

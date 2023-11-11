import { Module } from '@nestjs/common';
import { DBLogger } from './db-logger.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonLog } from '@rahino/database/models/core/winstonlog.entity';

@Module({
  imports: [SequelizeModule.forFeature([WinstonLog])],
  providers: [DBLogger],
  exports: [DBLogger],
})
export class DBLoggerModule {}

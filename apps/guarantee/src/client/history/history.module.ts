import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestHistory, GSRequest } from '@rahino/localdatabase/models';
import { HistoryController } from './history.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { HistoryMapper } from './history.mapper';
import { QueryFilterModule } from '@rahino/query-filter';

@Module({
  imports: [
    SequelizeModule,
    LocalizationModule,
    SequelizeModule.forFeature([BPMNRequestHistory, GSRequest]),
    QueryFilterModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryMapper],
  exports: [HistoryService],
})
export class ClientHistoryModule {}

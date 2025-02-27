import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestHistory } from '@rahino/localdatabase/models';
import { HistoryService } from './history.service';

@Module({
  imports: [SequelizeModule.forFeature([BPMNRequestHistory])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}

import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNPROCESS } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([BPMNPROCESS])],
  providers: [ProcessService],
  exports: [ProcessService],
})
export class ProcessModule {}

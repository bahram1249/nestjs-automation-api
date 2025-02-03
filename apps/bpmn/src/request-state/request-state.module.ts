import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNActivity, BPMNRequestState } from '@rahino/database';
import { RequestStateService } from './request-state.service';

@Module({
  imports: [SequelizeModule.forFeature([BPMNRequestState, BPMNActivity])],
  providers: [RequestStateService],
  exports: [RequestStateService],
})
export class RequestStateModule {}

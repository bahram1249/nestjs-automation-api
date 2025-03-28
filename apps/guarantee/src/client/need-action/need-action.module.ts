import { Module } from '@nestjs/common';
import { CartableService } from './need-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestState } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { CartableController } from './need-action.controller';

@Module({
  imports: [SequelizeModule.forFeature([BPMNRequestState, User, Permission])],
  controllers: [CartableController],
  providers: [CartableService],
  exports: [CartableService],
})
export class GSNeedActionModule {}

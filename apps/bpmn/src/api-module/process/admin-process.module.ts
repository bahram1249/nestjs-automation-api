import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNPROCESS } from '@rahino/localdatabase/models';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([BPMNPROCESS, User, Permission])],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class AdminProcessModule {}

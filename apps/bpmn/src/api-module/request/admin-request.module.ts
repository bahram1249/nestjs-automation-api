import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  BPMNRequest,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { RequestController } from './request.controller';
import { RequestCrudService } from './request.service';
import { BPMNRequestModule } from '../../modules/request/request.module';
import { User, Permission } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNRequest,
      BPMNPROCESS,
      BPMNOrganization,
      User,
      Permission,
    ]),
    BPMNRequestModule,
  ],
  controllers: [RequestController],
  providers: [RequestCrudService],
})
export class AdminRequestModule {}

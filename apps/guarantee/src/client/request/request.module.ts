import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNPROCESS,
  GSAssignedGuarantee,
  GSRequest,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BPMNRequestModule } from '@rahino/bpmn/modules/request/request.module';
import { GSAddressModule } from '../address/address.module';

@Module({
  imports: [
    SequelizeModule,
    BPMNRequestModule,
    GSAddressModule,
    SequelizeModule.forFeature([GSRequest, GSAssignedGuarantee, BPMNPROCESS]),
    LocalizationModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class GSClientRequestModule {}

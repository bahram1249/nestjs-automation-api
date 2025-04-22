import { Module } from '@nestjs/common';
import {
  BpmnInitializerService,
  ECommerceInitializerService,
  GuaranteeInitializerService,
  PcmInitializerService,
} from './services';

@Module({
  providers: [
    {
      provide: 'GuaranteeInitializerService',
      useClass: GuaranteeInitializerService,
    },
    {
      provide: 'BpmnInitializerService',
      useClass: BpmnInitializerService,
    },
    {
      provide: 'PcmInitializerService',
      useClass: PcmInitializerService,
    },
    {
      provide: 'ECommerceInitializerService',
      useClass: ECommerceInitializerService,
    },
  ],
})
export class ModuleInitializerModule {}

import { Module } from '@nestjs/common';
import {
  BpmnInitializerService,
  ECommerceInitializerService,
  GuaranteeInitializerService,
  PcmInitializerService,
} from './services';
import { ScriptRunnerModule } from '../script-runner';

@Module({
  imports: [ScriptRunnerModule],
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

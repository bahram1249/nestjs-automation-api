import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { SmsModuleOptions } from './sms-module-options.interface';

type SmsModuleOptionsAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<SmsModuleOptions>, 'useFactory' | 'inject'>;

export default SmsModuleOptionsAsyncOptions;

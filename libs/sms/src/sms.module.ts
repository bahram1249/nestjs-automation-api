import { DynamicModule, Module } from '@nestjs/common';
import { SmsModuleOptions } from './interface';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';
import SmsModuleOptionsAsyncOptions from './interface/sms-module-async-options.interface';

@Module({})
export class SmsModule {
  static register(options: SmsModuleOptions): DynamicModule {
    return {
      module: SmsModule,
      providers: [
        {
          provide: options.token,
          useFactory: (config: ConfigService) => {
            const username = config.get('SMS_USERNAME');
            const password = config.get('SMS_PASSWORD');
            return new SmsService(username, password, options.smsProvider);
          },
          inject: [ConfigService],
        },
      ],
      exports: [options.token],
    };
  }

  static registerAsync(options: SmsModuleOptionsAsyncOptions): DynamicModule {
    return {
      module: SmsModule,
      imports: options.imports,
      providers: [
        {
          provide: options.token,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [options.useFactory],
    };
  }
}

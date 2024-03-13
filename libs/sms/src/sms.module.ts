import { DynamicModule, Module } from '@nestjs/common';
import { SmsModuleOptions } from './interface';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';

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
            return new SmsService(
              username,
              password,
              options.smsProvider,
              options.bodyId,
            );
          },
          inject: [ConfigService],
        },
      ],
      exports: [options.token],
    };
  }
}

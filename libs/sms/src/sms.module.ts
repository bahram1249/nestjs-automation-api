import { Module } from '@nestjs/common';
import { MeliPayamakService } from './services/melipayamak.service';
import { MeliPayamakV2Service } from './services/melipayamakv2.service';
import { SMS_SERVICE } from './contants';
import { SmsProviderFactory } from './provider/sms-provider.factory';

@Module({
  providers: [
    {
      provide: SMS_SERVICE,
      useFactory(providerFactory: SmsProviderFactory) {
        return providerFactory.create();
      },
      inject: [SmsProviderFactory],
    },
    SmsProviderFactory,
    MeliPayamakService,
    MeliPayamakV2Service,
  ],
  exports: [SMS_SERVICE],
})
export class SmsModule {
  // static register(options: SmsModuleOptions): DynamicModule {
  //   return {
  //     module: SmsModule,
  //     providers: [
  //       {
  //         provide: options.token,
  //         useFactory: (config: ConfigService) => {
  //           const username = config.get('SMS_USERNAME');
  //           const password = config.get('SMS_PASSWORD');
  //           return new SmsService(username, password, options.smsProvider);
  //         },
  //         inject: [ConfigService],
  //       },
  //     ],
  //     exports: [options.token],
  //   };
  // }
  // static registerAsync(options: SmsModuleOptionsAsyncOptions): DynamicModule {
  //   return {
  //     module: SmsModule,
  //     imports: options.imports,
  //     providers: [
  //       {
  //         provide: SMS_SERVICE,
  //         useFactory: options.useFactory,
  //         inject: options.inject,
  //       },
  //       MeliPayamakService,
  //       MeliPayamakV2Service,
  //     ],
  //     exports: [SMS_SERVICE, MeliPayamakService, MeliPayamakV2Service],
  //   };
  // }
}

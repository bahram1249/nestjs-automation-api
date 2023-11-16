import { DynamicModule, Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayModuleOptions } from './interface';
import { SepProvider } from './provider';

@Module({
  providers: [SepProvider],
  exports: [SepProvider],
})
export class PayModule {
  static register(options: PayModuleOptions): DynamicModule {
    return {
      module: PayModule,
      providers: [
        {
          provide: options.token,
          useFactory: () => {
            return new PayService(options.paymentProvider);
          },
        },
      ],
      exports: [options.token],
    };
  }
}

import { Module, Scope } from '@nestjs/common';
import { CalPriceManualProviderFactory } from './factory';
import { ConfigService } from '@nestjs/config';
import { CAL_PRICE_PROVIDER_TOKEN } from './constants';
import { GoldonGalleryCalPriceModule } from './goldon-gallery-cal-price.module';
import { GeneralCalPriceModule } from './general-cal-price.module';

@Module({
  imports: [GoldonGalleryCalPriceModule, GeneralCalPriceModule],
  providers: [
    {
      provide: CAL_PRICE_PROVIDER_TOKEN,
      scope: Scope.REQUEST,
      useFactory(
        config: ConfigService,
        providerFactory: CalPriceManualProviderFactory,
      ) {
        const customerName = config.get<string>('CUSTOMER_NAME');
        return providerFactory.create(customerName);
      },
      inject: [ConfigService],
    },
    CalPriceManualProviderFactory,
  ],
  exports: [CAL_PRICE_PROVIDER_TOKEN],
})
export class CalPriceFactoryModule {}

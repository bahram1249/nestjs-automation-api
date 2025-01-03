import { Module, Scope } from '@nestjs/common';
import { CalPriceManualProviderFactory } from './factory';
import { CAL_PRICE_PROVIDER_TOKEN } from './constants';
import { GoldonGalleryCalPriceModule } from './goldon-gallery-cal-price.module';
import { GeneralCalPriceModule } from './general-cal-price.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';

@Module({
  imports: [
    GoldonGalleryCalPriceModule,
    GeneralCalPriceModule,
    SequelizeModule.forFeature([Setting]),
  ],
  providers: [
    {
      provide: CAL_PRICE_PROVIDER_TOKEN,
      scope: Scope.TRANSIENT,
      useFactory(providerFactory: CalPriceManualProviderFactory) {
        return providerFactory.create();
      },
      inject: [CalPriceManualProviderFactory],
    },
    CalPriceManualProviderFactory,
  ],
  exports: [CAL_PRICE_PROVIDER_TOKEN],
})
export class CalPriceFactoryModule {}

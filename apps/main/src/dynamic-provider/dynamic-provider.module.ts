import { DynamicModule, Module } from '@nestjs/common';
import { discountCoffeProviders } from './providers';
import { pcmProviders } from './providers/pcm.providers';
import { ecommerceProviders } from './providers/ecommerce.providers';

@Module({})
export class DynamicProviderModule {
  static register(): DynamicModule {
    let imports = [];
    if (process.env.PROJECT_NAME == 'DiscountCoffe') {
      imports = discountCoffeProviders;
    } else if (process.env.PROJECT_NAME == 'PCM') {
      imports = pcmProviders;
    } else if (process.env.PROJECT_NAME == 'ECommerce') {
      imports = ecommerceProviders;
    }
    return {
      module: DynamicProviderModule,
      imports: imports,
      exports: imports,
    };
  }
}

import { CoreModule } from '@rahino/core';
import { EAVModule } from '@rahino/eav';
import { ECommerceModule } from '@rahino/ecommerce';

export const ecommerceProviders = [CoreModule, EAVModule, ECommerceModule];

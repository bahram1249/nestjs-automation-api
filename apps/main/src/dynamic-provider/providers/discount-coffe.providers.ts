import { CoreModule } from '@rahino/core';
import { CoreDashboardModule } from '@rahino/coreDashboard';
import { DiscountCoffeModule } from '@rahino/discountCoffe';

export const discountCoffeProviders = [
  CoreModule,
  CoreDashboardModule,
  DiscountCoffeModule,
];

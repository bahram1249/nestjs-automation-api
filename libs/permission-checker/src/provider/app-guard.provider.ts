import { PermissionGuard } from '../guard';
import { APP_GUARD } from '@nestjs/core';

export const appGuardProviders = [
  {
    provide: APP_GUARD,
    useValue: PermissionGuard,
  },
];

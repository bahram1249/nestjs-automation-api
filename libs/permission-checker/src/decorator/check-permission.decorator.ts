import { SetMetadata } from '@nestjs/common';
import { PermissionReflector } from '../interface';

export const CheckPermission = (permission: PermissionReflector) =>
  SetMetadata('permission', permission);

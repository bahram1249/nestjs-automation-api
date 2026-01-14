import { CanActivate, ExecutionContext } from '@nestjs/common';

export class TestingJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth: string | undefined = req.headers['authorization'];
    const token = auth?.startsWith('Bearer ')
      ? auth.slice('Bearer '.length)
      : undefined;
    if (!token) return false;
    req.user = {
      id: 1,
      username: 'e2e-test-user',
      token,
    };
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TestingSessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'];
    if (!sessionId) return false;
    request.ecsession = { id: sessionId };
    return true;
  }
}

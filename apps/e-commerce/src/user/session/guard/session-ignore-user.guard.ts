import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidateSessionService } from './validate-session.service';

@Injectable()
export class SessionIgnoreUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly validateSessionService: ValidateSessionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.headers['x-session-id'];
    // if session not provided
    if (!session) return false;
    return await this.validateSessionService.validateIgnoreUser(
      request,
      session,
    );
  }
}

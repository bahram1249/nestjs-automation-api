import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidateSessionService } from './validate-session.service';

@Injectable()
export class OptionalSessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly validateSessionService: ValidateSessionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.headers['x-session-id'];
    // session is optional
    if (!session) return true;
    return await this.validateSessionService.validate(request, session);
  }
}

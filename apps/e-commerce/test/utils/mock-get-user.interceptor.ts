import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MockGetUserInterceptor implements NestInterceptor {
  constructor(private readonly mockUser: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.user = this.mockUser;
    return next.handle();
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  result: T;
}

@Injectable()
export class JsonResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        reqId: context.switchToHttp().getRequest().reqId,
        message: data.message || 'Success',
        result: data.result != undefined ? data.result : data,
        timestamp: new Date().toISOString(),
        path: context.switchToHttp().getRequest().url,
        total: data.total || 0,
      })),
    );
  }
}

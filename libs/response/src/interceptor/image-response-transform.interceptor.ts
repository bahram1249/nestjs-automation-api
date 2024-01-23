import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ImageResponse<T> {
  url: T;
}

@Injectable()
export class ImageResponseTransformInterceptor<T>
  implements NestInterceptor<T, ImageResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ImageResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        url: data.result,
      })),
    );
  }
}

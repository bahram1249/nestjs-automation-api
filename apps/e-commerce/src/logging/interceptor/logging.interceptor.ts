import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { REQUEST_LOGGING_JOB, REQUEST_LOGGING_QUEUE } from '../constants';
import { Queue } from 'bullmq';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue(REQUEST_LOGGING_QUEUE)
    private requestLoggingQueue: Queue,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(async () => {
        const request: Record<string, any> = context
          .switchToHttp()
          .getRequest();
        this.requestLoggingQueue.add(
          REQUEST_LOGGING_JOB,
          {
            requestData: {
              begin: now,
              end: Date.now(),
              ip: request.ips.length ? request.ips[0] : request.ip,
              url: request.url,
              method: request.method,
            },
            session: request.ecsession,
            user: request.user,
          },
          {
            removeOnComplete: {
              age: 3600,
              count: 100,
            },
            removeOnFail: {
              age: 24 * 3600,
            },
          },
        );
      }),
    );
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DBLogger } from '@rahino/logger';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: DBLogger) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
      await this.logger.error(exception.message, exception.stack, null, {
        statusCode: status,
        method: request.method,
        path: request.url,
        user: request.user,
        ip: request.ip,
        timestamp: new Date().toISOString(),
        stack: exception.stack,
      });
    }
    response.status(status).json({
      statusCode: status,
      message:
        status == HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : exception.message,
      errors:
        status == HttpStatus.BAD_REQUEST
          ? exception.getResponse().valueOf()['message']
          : [],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
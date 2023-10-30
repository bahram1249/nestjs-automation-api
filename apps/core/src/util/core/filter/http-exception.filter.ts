import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DBLogger } from '../logger/db-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: DBLogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.message, {
        statusCode: status,
        method: request.method,
        path: request.url,
        user: request.user,
        timestamp: new Date().toISOString(),
        stack: exception.stack,
      });
    }
    console.log(exception);
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

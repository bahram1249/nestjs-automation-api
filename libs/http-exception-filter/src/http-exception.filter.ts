import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DBLogger } from '@rahino/logger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import * as _ from 'lodash';
import { I18nContext, I18nService, I18nValidationError } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';

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
      const user = request.user || {};
      await this.logger.error(exception.message, exception.stack, null, {
        statusCode: status,
        method: request.method,
        path: request.url,
        user: _.pick(user, ['id', 'firstname', 'lastname', 'username']),
        ip: request.ips.length ? request.ips[0] : request.ip,
        body: request.body,
        timestamp: new Date().toISOString(),
        cause: exception.cause,
        stack: exception.stack,
      });
    }
    const apiRegex = /^v[0-9]+/g;
    // if the request send it to web

    if (!apiRegex.test(request.url.split('/')[1])) {
      if (status == 400) {
        console.log(exception.getResponse().valueOf()['message']);
        return response.status(status).render('error/400', { layout: false });
      } else if (status == 401) {
        return response.status(status).render('error/401', { layout: false });
      } else if (status == 403) {
        return response.status(status).render('error/403', { layout: false });
      } else if (status == 404) {
        return response.status(status).render('error/404', { layout: false });
      } else {
        return response.status(status).render('error/error', { layout: false });
      }
    }

    const i18n = I18nContext.current();

    const errors = formatI18nErrors(exception['errors'] ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const errMsg = [];
    errors.forEach((error: ValidationError) => {
      errMsg.push(...[...Object.values(error.constraints)]);
    });

    // if the request send it to api
    response.status(status).json({
      statusCode: status,
      message:
        status == HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : exception.message,
      errors: status == HttpStatus.BAD_REQUEST ? errMsg : [],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    //exception.getResponse().valueOf()['message']
  }
}

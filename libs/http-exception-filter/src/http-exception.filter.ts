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
import {
  I18nContext,
  I18nService,
  I18nValidationError,
  I18nValidationException,
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n';
import {
  formatI18nErrors,
  mapChildrenToValidationErrors,
} from 'nestjs-i18n/dist/utils';
import iterate from 'iterare';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: DBLogger,
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: false,
    },
  ) {}
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

    // if (!apiRegex.test(request.url.split('/')[1])) {
    //   if (status == 400) {
    //     console.log(exception.getResponse().valueOf()['message']);
    //     return response.status(status).render('error/400', { layout: false });
    //   } else if (status == 401) {
    //     return response.status(status).render('error/401', { layout: false });
    //   } else if (status == 403) {
    //     return response.status(status).render('error/403', { layout: false });
    //   } else if (status == 404) {
    //     return response.status(status).render('error/404', { layout: false });
    //   } else {
    //     return response.status(status).render('error/error', { layout: false });
    //   }
    // }

    let responseBody;
    if (exception instanceof I18nValidationException) {
      const i18n = I18nContext.current();
      const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
        lang: i18n.lang,
      });
      const normalizedErrors = this.normalizeValidationErrors(errors);
      responseBody = this.buildResponseBody(host, exception, normalizedErrors);
    }

    if (responseBody) {
      response
        .status(this.options.errorHttpStatusCode || exception.getStatus())
        .send(responseBody);
    } else {
      // if the request send it to api
      response.status(status).json({
        statusCode: status,
        message:
          status == HttpStatus.INTERNAL_SERVER_ERROR
            ? 'Internal Server Error'
            : exception.message,
        errors:
          status == HttpStatus.BAD_REQUEST
            ? exception.getResponse().valueOf()['message']
            : status != HttpStatus.INTERNAL_SERVER_ERROR
              ? [exception.message]
              : [],
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private isWithErrorFormatter(
    options: I18nValidationExceptionFilterOptions,
  ): options is I18nValidationExceptionFilterErrorFormatterOption {
    return 'errorFormatter' in options;
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options)
    )
      return this.options.errorFormatter(validationErrors);

    if (
      !this.isWithErrorFormatter(this.options) &&
      !this.options.detailedErrors
    )
      return this.flattenValidationErrors(validationErrors);

    return validationErrors;
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();
  }

  protected buildResponseBody(
    host: ArgumentsHost,
    exc: I18nValidationException,
    errors: string[] | I18nValidationError[] | object,
  ) {
    if ('responseBodyFormatter' in this.options) {
      return this.options.responseBodyFormatter(host, exc, errors);
    } else {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const status =
        exc instanceof HttpException
          ? exc.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        statusCode: status,
        message:
          status == HttpStatus.INTERNAL_SERVER_ERROR
            ? 'Internal Server Error'
            : exc.message,
        errors: status == HttpStatus.BAD_REQUEST ? errors : [],
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
  }
}

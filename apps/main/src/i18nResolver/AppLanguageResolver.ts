import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class AppLanguageResolver implements I18nResolver {
  constructor() {}

  resolve(
    context: ExecutionContext,
  ): Promise<string | string[] | undefined> | string | string[] | undefined {
    return 'fa';
  }
}

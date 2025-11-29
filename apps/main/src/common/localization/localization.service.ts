import { Injectable } from '@nestjs/common';
import { I18nTranslations } from '../../generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PathImpl2 } from '@nestjs/config';

@Injectable()
export class LocalizationService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  translate(
    translation: PathImpl2<I18nTranslations>,
    args?: Record<string, any>,
  ) {
    return this.i18n.translate(translation, {
      lang: I18nContext.current() ? I18nContext.current().lang : 'fa',
      args,
    });
  }
}

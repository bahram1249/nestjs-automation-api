import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Op } from 'sequelize';

@Injectable()
export class GoldPriceService {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  private readonly GOLD_740_PRICE = 'GOLD_740_PRICE';
  private readonly GOLD_24_PRICE = 'GOLD_24_PRICE';
  private readonly GOLD_SECOND_HAND_PRICE = 'GOLD_SECOND_HAND_PRICE';
  constructor(
    @InjectModel(Setting) private readonly settingRepository: typeof Setting,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll() {
    const settings = await this.settingRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          key: {
            [Op.in]: [
              this.GOLD_24_PRICE,
              this.GOLD_740_PRICE,
              this.GOLD_CURRENT_PRICE,
              this.GOLD_SECOND_HAND_PRICE,
            ],
          },
        })
        .build(),
    );

    return settings.map((setting) => {
      switch (setting.key) {
        case this.GOLD_CURRENT_PRICE:
          return {
            key: 'طلای ۱۸ عیار ۷۵۰',
            value: setting.value,
          };
        case this.GOLD_740_PRICE:
          return {
            key: 'طلای ۱۸ عیار ۷۴۰',
            value: setting.value,
          };
        case this.GOLD_24_PRICE:
          return {
            key: 'طلای ۲۴ عیار',
            value: setting.value,
          };
        case this.GOLD_SECOND_HAND_PRICE:
          return {
            key: 'طلای دست دوم',
            value: setting.value,
          };
      }
    });
  }

  async goldCurrentPrice() {
    const result = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE })
        .build(),
    );
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: result.value,
    };
  }
}

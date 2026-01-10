import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GSDiscountCode, GSUnitPrice } from '@rahino/localdatabase/models';
import { GSDiscountCodeUsage } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op, Transaction } from 'sequelize';
import { RialPriceService } from '../rial-price/rial-price.service';
import { GSDiscountTypeEnum } from '../discount-type/enum';
import { DiscountUsageInfo, DiscountValidationResult } from './interface';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class DiscountCodeValidationService {
  constructor(
    @InjectModel(GSDiscountCode)
    private readonly discountCodeRepository: typeof GSDiscountCode,
    @InjectModel(GSDiscountCodeUsage)
    private readonly discountCodeUsageRepository: typeof GSDiscountCodeUsage,
    private readonly rialPriceService: RialPriceService,
    private readonly localizationService: LocalizationService,
  ) {}

  async validateDiscountCode(
    discountCode: string,
    userId: bigint,
  ): Promise<DiscountValidationResult> {
    // find discountCode
    const discountCodeEntity = await this.discountCodeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ code: discountCode, isActive: true })
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .build(),
    );

    if (!discountCodeEntity) {
      return {
        isValid: false,
        canApply: false,
        error: this.localizationService
          .translate('guarantee.discount_code_not_found_or_inactive')
          .toString(),
      };
    }

    const now = new Date();
    if (
      discountCodeEntity.validFrom > now ||
      discountCodeEntity.validUntil < now
    ) {
      return {
        isValid: false,
        canApply: false,
        discountCode: discountCodeEntity,
        error: this.localizationService
          .translate('guarantee.discount_code_has_expired')
          .toString(),
      };
    }

    const discountCodeUsage = await this.getDiscountCodeUsage(
      discountCodeEntity.id,
      userId,
    );

    // validate userUsage
    if (discountCodeUsage.userUsage >= discountCodeEntity.perUserUsageLimit) {
      return {
        isValid: true,
        canApply: false,
        discountCode: discountCodeEntity,
        error: this.localizationService
          .translate('guarantee.personal_usage_limit_reached')
          .toString(),
      };
    }

    // validate total usage
    if (discountCodeUsage.totalUsage >= discountCodeEntity.totalUsageLimit) {
      return {
        isValid: true,
        canApply: false,
        discountCode: discountCodeEntity,
        error: this.localizationService
          .translate('guarantee.total_usage_limit_reached')
          .toString(),
      };
    }

    return {
      isValid: true,
      canApply: true,
      discountCode: discountCodeEntity,
    };
  }

  async calculateDiscount(
    discountCode: GSDiscountCode,
    originalPriceInRial: number,
  ): Promise<number> {
    let discountAmountInRial = await this.calculateDiscountAmountInRial(
      discountCode,
      originalPriceInRial,
    );

    const maxDiscountAmount = Number(discountCode.maxDiscountAmount);

    const maxDiscountAmountInRial = this.rialPriceService.getRialPrice({
      price: maxDiscountAmount,
      unitPriceId: discountCode.unitPriceId,
    });

    if (discountAmountInRial > maxDiscountAmountInRial) {
      discountAmountInRial = maxDiscountAmountInRial;
    }

    if (discountAmountInRial > originalPriceInRial) {
      discountAmountInRial = originalPriceInRial;
    }

    return discountAmountInRial;
  }

  async incrementUsage(
    discountCode: GSDiscountCode,
    userId: bigint,
    factorId: bigint,
    discountAmount: number,
    transaction?: Transaction,
  ): Promise<void> {
    await this.discountCodeUsageRepository.create(
      {
        discountCodeId: discountCode.id,
        userId,
        factorId,
        discountAmount: discountAmount,
        maxDiscountAmount: discountCode.maxDiscountAmount,
        usedAt: new Date(),
      },
      {
        transaction: transaction,
      },
    );
  }

  private async getDiscountCodeUsage(
    discountCodeId: bigint,
    userId: bigint,
  ): Promise<DiscountUsageInfo> {
    const totalUsage = await this.discountCodeUsageRepository.count({
      where: { discountCodeId },
    });

    const userUsage = await this.discountCodeUsageRepository.count({
      where: { discountCodeId, userId },
    });

    return {
      totalUsage,
      userUsage,
    };
  }

  private async calculateDiscountAmountInRial(
    discountCode: GSDiscountCode,
    originalPriceInRial: number,
  ) {
    if (discountCode.discountTypeId == GSDiscountTypeEnum.Percentage) {
      const discountValue = Number(discountCode.discountValue);
      const discountPercentage = discountValue / 100;
      return (
        (originalPriceInRial * Math.floor(discountPercentage * 100)) / 10000
      );
    }
    const discountValue = this.rialPriceService.getRialPrice({
      price: Number(discountCode.discountValue),
      unitPriceId: discountCode.unitPriceId,
    });

    return discountValue;
  }
}

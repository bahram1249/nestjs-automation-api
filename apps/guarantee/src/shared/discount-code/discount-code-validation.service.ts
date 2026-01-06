import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException } from '@nestjs/common';
import {
  GSDiscountCode,
  GSPaymentGateway,
  GSUnitPrice,
} from '@rahino/localdatabase/models';
import { GSPaymentWayEnum } from '../payment-way/enum/gs-payment-way.enum';
import { GSDiscountCodeUsage } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op } from 'sequelize';
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
    @InjectModel(GSPaymentGateway)
    private readonly paymentGateWayRepository: typeof GSPaymentGateway,
    private readonly rialPriceService: RialPriceService,
    private readonly localizationService: LocalizationService,
  ) {}

  async validateDiscountCode(
    discountCode: string,
    userId: bigint,
  ): Promise<DiscountValidationResult> {
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
        error: this.localizationService
          .translate('guarantee.discount_code_has_expired')
          .toString(),
      };
    }

    const discountCodeUsage = await this.getDiscountCodeUsage(
      discountCodeEntity.id,
      userId,
    );

    if (discountCodeUsage.userUsage >= discountCodeEntity.perUserUsageLimit) {
      return {
        isValid: true,
        canApply: false,
        error: this.localizationService
          .translate('guarantee.personal_usage_limit_reached')
          .toString(),
      };
    }

    if (discountCodeUsage.totalUsage >= discountCodeEntity.totalUsageLimit) {
      return {
        isValid: true,
        canApply: false,
        error: this.localizationService
          .translate('guarantee.total_usage_limit_reached')
          .toString(),
      };
    }

    return {
      isValid: true,
      canApply: true,
    };
  }

  async calculateDiscount(
    discountCodeId: bigint,
    originalPriceInRial: number,
  ): Promise<number> {
    const discountCode = await this.discountCodeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: discountCodeId })
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .include([{ model: GSDiscountCode, as: 'discountType' }])
        .build(),
    );

    if (!discountCode) {
      throw new BadRequestException('Discount code not found');
    }

    let discountAmount: number;
    const originalPriceBigInt = originalPriceInRial;

    if (discountCode.discountTypeId == GSDiscountTypeEnum.Percentage) {
      const discountValue = Number(discountCode.discountValue);
      if (isNaN(discountValue)) {
        throw new BadRequestException('Invalid discount value');
      }
      const discountPercentage = discountValue / 100;
      discountAmount =
        (originalPriceBigInt * Math.floor(discountPercentage * 100)) / 10000;
    } else {
      const discountValue = Number(discountCode.discountValue);
      if (isNaN(discountValue)) {
        throw new BadRequestException('Invalid discount value');
      }
      discountAmount = discountValue;
    }

    const discountAmountInRial = this.rialPriceService.getRialPrice({
      price: Number(discountAmount),
      unitPriceId: discountCode.unitPriceId,
    });

    const maxDiscountAmount = Number(discountCode.maxDiscountAmount);
    if (isNaN(maxDiscountAmount)) {
      throw new BadRequestException('Invalid max discount amount');
    }
    const maxDiscountAmountInRial = this.rialPriceService.getRialPrice({
      price: maxDiscountAmount,
      unitPriceId: discountCode.unitPriceId,
    });

    if (discountAmountInRial > maxDiscountAmountInRial) {
      return maxDiscountAmountInRial;
    }

    return discountAmountInRial;
  }

  async getDiscountCodeUsage(
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

  async getDiscountGatewayId(): Promise<number> {
    const paymentGateway = await this.paymentGateWayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentWayId: GSPaymentWayEnum.Discount })
        .build(),
    );

    if (!paymentGateway) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.discount_payment_gateway_not_found',
        ),
      );
    }

    return paymentGateway.id;
  }

  async incrementUsage(
    discountCodeId: bigint,
    userId: bigint,
    factorId: bigint,
    discountAmount: number,
    maxDiscountAmount?: bigint,
  ): Promise<void> {
    const discountCode = await this.discountCodeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: discountCodeId })
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .build(),
    );

    if (!discountCode) {
      throw new BadRequestException(
        this.localizationService.translate('guarantee.discount_code_not_found'),
      );
    }

    const actualDiscountAmount = maxDiscountAmount || discountAmount;

    await this.discountCodeUsageRepository.create({
      discountCodeId,
      userId,
      factorId,
      discountAmount: actualDiscountAmount,
      maxDiscountAmount: discountCode.maxDiscountAmount,
      usedAt: new Date(),
    });
  }

  async getDiscountCodeByCode(code: string): Promise<GSDiscountCode | null> {
    const discountCode = await this.discountCodeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ code })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    return discountCode;
  }
}

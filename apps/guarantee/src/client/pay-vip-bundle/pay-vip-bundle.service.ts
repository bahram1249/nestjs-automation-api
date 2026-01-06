import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import {
  GSFactor,
  GSFactorVipBundle,
  GSVipBundleType,
  GSDiscountCode,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GS_PAYMENT_PROVIDER_TOKEN } from '@rahino/guarantee/shared/payment-provider/constants';
import { GSPaymentInterface } from '@rahino/guarantee/shared/payment/interface/gs-payment.interface';
import { GSRequestPaymentOutputDto } from '@rahino/guarantee/shared/payment/dto/gs-request-payment-output.dto';
import { RialPriceService } from '@rahino/guarantee/shared/rial-price';
import { DiscountCodeValidationService } from '@rahino/guarantee/shared/discount-code/discount-code-validation.service';
import { DiscountCodePreviewResultDto } from '@rahino/guarantee/shared/discount-code/dto';
import { PayVipBundleDto } from './dto';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';

@Injectable()
export class PayVipBundleService {
  constructor(
    @InjectModel(GSFactorVipBundle)
    private readonly factorVipBundleRepository: typeof GSFactorVipBundle,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,
    @InjectModel(GSDiscountCode)
    private readonly discountCodeRepository: typeof GSDiscountCode,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @Inject(GS_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentService: GSPaymentInterface,
    private readonly rialPriceService: RialPriceService,
    @Inject(DiscountCodeValidationService)
    private readonly discountCodeValidationService: DiscountCodeValidationService,
  ) {}

  async create(user: User, dto: PayVipBundleDto) {
    const vipBundleType = await this.vipBundleTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: BigInt(dto.vipBundleTypeId) })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );

    if (!vipBundleType) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    let result: GSRequestPaymentOutputDto;

    if (!dto.discountCode || dto.discountCode.trim() === '') {
      result = await this.createFactorAndMakeTransaction(user, vipBundleType);
    } else {
      const validation =
        await this.discountCodeValidationService.validateDiscountCode(
          dto.discountCode,

          user.id,
        );

      if (!validation.canApply) {
        throw new BadRequestException(
          validation.error ||
            this.localizationService.translate(
              'guarantee.discount_code_not_applicable',
            ),
        );
      }

      const discountCode = await this.discountCodeRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ code: dto.discountCode })
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

      if (!discountCode) {
        throw new BadRequestException(
          this.localizationService.translate(
            'guarantee.discount_code_not_found',
          ),
        );
      }

      const discountAmountInRial =
        await this.discountCodeValidationService.calculateDiscount(
          discountCode.id,
          await this.rialPriceService.getRialPrice({
            price: Number(vipBundleType.price),
            unitPriceId: vipBundleType.unitPriceId,
          }),
        );

      const discountPaymentGatewayId =
        await this.discountCodeValidationService.getDiscountGatewayId();

      result = await this.createFactorAndMakeTransactionWithDiscount(
        user,
        vipBundleType,
        discountCode.id,
        discountAmountInRial,
        BigInt(discountPaymentGatewayId),
      );
    }

    return { result };
  }

  async createFactorAndMakeTransaction(
    user: User,
    vipBundleType: GSVipBundleType,
  ): Promise<GSRequestPaymentOutputDto> {
    const totalPrices = this.rialPriceService.getRialPrice({
      price: Number(vipBundleType.price),
      unitPriceId: vipBundleType.unitPriceId,
    });

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const factor = await this.factorRepository.create(
        {
          unitPriceId: GSUnitPriceEnum.Rial,
          totalPrice: totalPrices,
          factorStatusId: GSFactorStatusEnum.WaitingForPayment,
          factorTypeId: GSFactorTypeEnum.BuyVipCard,
          userId: user.id,
          expireDate: Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            7,
            Sequelize.fn('getdate'),
          ),
        },
        { transaction: transaction },
      );

      await this.factorVipBundleRepository.create(
        {
          factorId: factor.id,
          vipBundleTypeId: vipBundleType.id,
          itemPrice: BigInt(totalPrices),
          unitPriceId: GSUnitPriceEnum.Rial,
          fee: BigInt(
            this.rialPriceService.getRialPrice({
              price: Number(vipBundleType.fee),
              unitPriceId: vipBundleType.unitPriceId,
            }),
          ),
        },
        {
          transaction: transaction,
        },
      );

      const result = await this.paymentService.requestPayment({
        factorId: factor.id,
        userId: user.id,
        transaction: transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async createFactorAndMakeTransactionWithDiscount(
    user: User,
    vipBundleType: GSVipBundleType,
    discountCodeId: bigint,
    discountAmountInRial: bigint,
    discountPaymentGatewayId: bigint,
  ): Promise<GSRequestPaymentOutputDto> {
    const totalPrices = this.rialPriceService.getRialPrice({
      price: Number(vipBundleType.price),
      unitPriceId: vipBundleType.unitPriceId,
    });

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const factor = await this.factorRepository.create(
        {
          unitPriceId: GSUnitPriceEnum.Rial,
          totalPrice: totalPrices,
          factorStatusId: GSFactorStatusEnum.WaitingForPayment,
          factorTypeId: GSFactorTypeEnum.BuyVipCard,
          userId: user.id,
          expireDate: Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            7,
            Sequelize.fn('getdate'),
          ),
        },
        { transaction: transaction },
      );

      await this.factorVipBundleRepository.create(
        {
          factorId: factor.id,
          vipBundleTypeId: vipBundleType.id,
          itemPrice: BigInt(totalPrices),
          unitPriceId: GSUnitPriceEnum.Rial,
          fee: BigInt(
            this.rialPriceService.getRialPrice({
              price: Number(vipBundleType.fee),
              unitPriceId: vipBundleType.unitPriceId,
            }),
          ),
        },
        {
          transaction: transaction,
        },
      );

      let transactionRecord = await this.transactionRepository.create(
        {
          transactionStatusId: GSTransactionStatusEnum.Paid,
          unitPriceId: GSUnitPriceEnum.Rial,
          totalPrice: discountAmountInRial,
          factorId: factor.id,
          userId: user.id,
          paymentGatewayId: discountPaymentGatewayId,
        },
        { transaction: transaction },
      );

      await this.discountCodeValidationService.incrementUsage(
        discountCodeId,
        user.id,
        factor.id,
        discountAmountInRial,
      );

      const result = await this.paymentService.requestPayment({
        factorId: factor.id,
        userId: user.id,
        transaction: transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async preview(
    user: User,
    vipBundleTypeId: number,
    discountCode?: string,
  ): Promise<{ result: DiscountCodePreviewResultDto }> {
    const vipBundleType = await this.vipBundleTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: vipBundleTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );

    if (!vipBundleType) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    if (!discountCode || discountCode.trim() === '') {
      const originalPrice = Number(vipBundleType.price);
      return {
        result: {
          discountCodeId: 0n,
          discountCode: '',
          originalPrice,
          discountAmount: 0n,
          finalPrice: originalPrice,
          userPayAmount: originalPrice,
          canApply: false,
          error: undefined,
        },
      };
    }

    const validation =
      await this.discountCodeValidationService.validateDiscountCode(
        discountCode,

        user.id,
      );

    if (!validation.canApply) {
      const originalPrice = Number(vipBundleType.price);
      return {
        result: {
          discountCodeId: 0n,
          discountCode: '',
          originalPrice,
          discountAmount: 0n,
          finalPrice: originalPrice,
          userPayAmount: originalPrice,
          canApply: false,
          error: validation.error,
        },
      };
    }

    const discountCodeEntity = await this.discountCodeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ code: discountCode })
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

    if (!discountCodeEntity) {
      const originalPrice = Number(vipBundleType.price);
      return {
        result: {
          discountCodeId: 0n,
          discountCode: '',
          originalPrice,
          discountAmount: 0n,
          finalPrice: originalPrice,
          userPayAmount: originalPrice,
          canApply: false,
          error: this.localizationService
            .translate('guarantee.discount_code_not_found')
            .toString(),
        },
      };
    }

    const discountAmount =
      await this.discountCodeValidationService.calculateDiscount(
        discountCodeEntity.id,
        Number(vipBundleType.price),
      );

    const originalPrice = Number(vipBundleType.price);
    const finalPrice = originalPrice - Number(discountAmount);

    return {
      result: {
        discountCodeId: discountCodeEntity.id,
        discountCode,
        originalPrice,
        discountAmount,
        finalPrice,
        userPayAmount: finalPrice,
        canApply: true,
        error: undefined,
      },
    };
  }
}

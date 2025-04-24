import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PayVipBundleDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import {
  GSFactor,
  GSFactorVipBundle,
  GSVipBundleType,
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

@Injectable()
export class PayVipBundleService {
  constructor(
    @InjectModel(GSFactorVipBundle)
    private readonly factorVipBundleRepository: typeof GSFactorVipBundle,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @Inject(GS_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentService: GSPaymentInterface,
    private readonly rialPriceService: RialPriceService,
  ) {}

  async create(user: User, dto: PayVipBundleDto) {
    const vipBundleType = await this.vipBundleTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.vipBundleTypeId })
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

    const result = await this.createFactorAndMakeTransaction(
      user,
      vipBundleType,
    );
    return { result };
  }

  private async createFactorAndMakeTransaction(
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
      // create factor
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

      // create request payment
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
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PayAdditionalPackageDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import {
  GSAdditionalPackage,
  GSAssignedGuarantee,
  GSFactor,
  GSFactorAdditionalPackage,
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
export class PayAdditionalPackageService {
  constructor(
    @InjectModel(GSFactorAdditionalPackage)
    private readonly factorAdditionalPackageRepository: typeof GSFactorAdditionalPackage,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSAdditionalPackage)
    private readonly additionalPackageRepository: typeof GSAdditionalPackage,
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @Inject(GS_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentService: GSPaymentInterface,
    private readonly rialPriceService: RialPriceService,
  ) {}

  async create(user: User, dto: PayAdditionalPackageDto) {
    const assignedGuaranteeRepository =
      await this.assignedGuaranteeRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ guaranteeId: dto.guaranteeId })
          .build(),
      );
    if (!assignedGuaranteeRepository) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.details_of_requested_card_is_not_found',
        ),
      );
    }
    const additionalPackages = await this.additionalPackageRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          id: {
            [Op.in]: dto.additionalPackages,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (additionalPackages.length !== dto.additionalPackages.length) {
      throw new BadRequestException('invalid additional packages');
    }
    const result = await this.createFactorAndMakeTransaction(
      user,
      dto.guaranteeId,
      additionalPackages,
    );
    return { result };
  }

  private async createFactorAndMakeTransaction(
    user: User,
    guaranteeId: bigint,
    additionalPackages: GSAdditionalPackage[],
  ): Promise<GSRequestPaymentOutputDto> {
    const totalPricesRial = additionalPackages.map((additionalPackage) =>
      this.rialPriceService.getRialPrice({
        price: Number(additionalPackage.price),
        unitPriceId: additionalPackage.unitPriceId,
      }),
    );
    const totalPrices = totalPricesRial.reduce((a, b) => a + b, 0);

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
          factorTypeId: GSFactorTypeEnum.BuyAdditionalPackage,
          userId: user.id,
          expireDate: Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            7,
            Sequelize.fn('getdate'),
          ),
          guaranteeId: guaranteeId,
        },
        { transaction: transaction },
      );

      for (const additionalPackage of additionalPackages) {
        await this.factorAdditionalPackageRepository.create(
          {
            factorId: factor.id,
            additionalPackageId: additionalPackage.id,
            itemPrice: this.rialPriceService.getRialPrice({
              price: Number(additionalPackage.price),
              unitPriceId: additionalPackage.unitPriceId,
            }),
          },
          {
            transaction: transaction,
          },
        );
      }
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

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GSPaymentWayEnum } from '@rahino/guarantee/shared/payment-way';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import {
  GSFactor,
  GSGuarantee,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class ResetFactorActionService implements ActionServiceImp {
  constructor(
    @InjectModel(GSFactor) private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSPaymentGateway)
    private readonly paymentGatewayRepository: typeof GSPaymentGateway,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ requestId: dto.request.id })
        .filter({ factorTypeId: GSFactorTypeEnum.PayRequestFactor })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .transaction(dto.transaction)
        .build(),
    );
    if (factor) {
      const paymentGateway = await this.paymentGatewayRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ paymentWayId: GSPaymentWayEnum.VipBalance })
          .build(),
      );

      if (!paymentGateway) {
        throw new InternalServerErrorException(
          'cannot find payment gateway for normal guarantee',
        );
      }

      const vipTransaction = await this.transactionRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ factorId: factor.id })
          .filter({ paymentGatewayId: paymentGateway.id })
          .transaction(dto.transaction)
          .build(),
      );

      if (vipTransaction) {
        await this.transactionRepository.create(
          {
            factorId: factor.id,
            transactionStatusId: GSTransactionStatusEnum.RevertVip,
            unitPriceId: GSUnitPriceEnum.Rial,
            totalPrice: vipTransaction.totalPrice,
            paymentGatewayId: paymentGateway.id,
            userId: dto.userExecuterId,
          },
          {
            transaction: dto.transaction,
          },
        );

        const request = await this.requestRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: factor.requestId })
            .transaction(dto.transaction)
            .build(),
        );

        const guarantee = await this.guaranteeRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: request.guaranteeId })
            .transaction(dto.transaction)
            .build(),
        );

        guarantee.availableCredit =
          guarantee.availableCredit + vipTransaction.totalPrice;

        await guarantee.save({ transaction: dto.transaction });
      }

      factor.isDeleted = true;
      await factor.save({ transaction: dto.transaction });
    }
  }
}

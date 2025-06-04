import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { GSPaymentWayEnum } from '@rahino/guarantee/shared/payment-way';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { GSPaymentGateway, GSTransaction } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class RemainingTransactionInCashActionService
  implements ActionServiceImp
{
  constructor(
    private readonly factorDeatilAndRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    @InjectModel(GSPaymentGateway)
    private readonly paymentGatewayRepository: typeof GSPaymentGateway,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const { result } =
      await this.factorDeatilAndRemainingAmountService.getFactorDetailAndRemainingAmount(
        dto.request.id,
        dto.transaction,
      );

    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentWayId: GSPaymentWayEnum.Cash })
        .transaction(dto.transaction)
        .build(),
    );

    if (!paymentGateway) {
      throw new BadRequestException('cannot find any cash paymentGateway');
    }

    // create cash payment
    await this.transactionRepository.create(
      {
        factorId: result.factor.id,
        transactionStatusId: GSTransactionStatusEnum.Paid,
        unitPriceId: GSUnitPriceEnum.Rial,
        totalPrice: result.remainingAmount,
        paymentGatewayId: paymentGateway.id,
        userId: result.factor.userId,
      },
      { transaction: dto.transaction },
    );
  }
}

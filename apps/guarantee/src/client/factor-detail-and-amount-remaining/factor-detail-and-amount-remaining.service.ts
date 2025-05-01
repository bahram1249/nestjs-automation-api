import { Injectable } from '@nestjs/common';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { GSTransaction } from '@rahino/localdatabase/models';
import { TransactionOutputDto } from './dto';
import { RialPriceService } from '@rahino/guarantee/shared/rial-price';

@Injectable()
export class GSFactorDeatilAndRemainingAmountService {
  constructor(
    private readonly sharedFactorRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
    private readonly rialPriceService: RialPriceService,
  ) {}

  async findFactorDeatilAndRemainingAmount(requestId: bigint) {
    const { result } =
      await this.sharedFactorRemainingAmountService.getFactorDetailAndRemainingAmount(
        requestId,
      );

    return {
      result: {
        remainingAmount: result.remainingAmount,
        transactions: this.mapTransactions(result.transactions),
        partServices: result.partServices,
        solutionServices: result.solutionServices,
        isAvailableForOnlinePayment: result.isAvailableForOnlinePayment,
        factor: result.factor,
      },
    };
  }

  private mapTransactions(transactions: GSTransaction[]) {
    return transactions.map((transactionItem) => {
      return this.mapTransaction(transactionItem);
    });
  }

  private mapTransaction(transactionItem: GSTransaction): TransactionOutputDto {
    return {
      transactionId: transactionItem.id,
      paymentGatewayTitle: transactionItem.paymentGateway.title,
      price: this.rialPriceService.getRialPrice({
        price: Number(transactionItem.totalPrice),
        unitPriceId: transactionItem.unitPriceId,
      }),
      transactionDate: transactionItem.createdAt,
    };
  }
}

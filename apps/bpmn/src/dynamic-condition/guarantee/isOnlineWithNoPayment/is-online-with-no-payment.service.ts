import { Injectable } from '@nestjs/common';
import { CheckConditionsDto } from '@rahino/bpmn/modules/condition';
import { ConditionServiceImp } from '@rahino/bpmn/modules/condition/interface';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Injectable({})
export class IsOnlineWithNoPaymentService implements ConditionServiceImp {
  constructor(
    private readonly factorDetailAndRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
  ) {}
  async check(dto: CheckConditionsDto): Promise<boolean> {
    const { result } =
      await this.factorDetailAndRemainingAmountService.getFactorDetailAndRemainingAmount(
        dto.request.id,
        dto.transaction,
      );

    if (result.isOnlinePayment && result.remainingAmount == 0) return true;
    return false;
  }
}

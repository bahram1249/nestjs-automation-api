import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import { GSFactor } from '@rahino/localdatabase/models';

@Injectable()
export class UpdateRequestFactorToSucessActionService
  implements ActionServiceImp
{
  constructor(
    private readonly factorDeatilAndRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const { result } =
      await this.factorDeatilAndRemainingAmountService.getFactorDetailAndRemainingAmount(
        dto.request.id,
        dto.transaction,
      );
    const factorId = result.factor.id;

    // update factor status to paid
    await this.factorRepository.update(
      { factorStatusId: GSFactorStatusEnum.Paid },
      {
        where: {
          id: factorId,
        },
        transaction: dto.transaction,
      },
    );
  }
}

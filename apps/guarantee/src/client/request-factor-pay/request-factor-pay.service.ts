import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickPaymentWayDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSFactor, GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseService } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.service';
import { GS_PAYMENT_PROVIDER_TOKEN } from '@rahino/guarantee/shared/payment-provider/constants';
import { GSPaymentInterface } from '@rahino/guarantee/shared/payment/interface/gs-payment.interface';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Injectable()
export class RequestFactorPayService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,

    @Inject(GS_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentService: GSPaymentInterface,

    private readonly sharedFactorRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
  ) {}

  async traverse(user: User, dto: PickPaymentWayDto) {
    dto.isClientSideCartable = true;
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );

    const { result: factorDetail } =
      await this.sharedFactorRemainingAmountService.getFactorDetailAndRemainingAmount(
        dto.requestId,
      );

    let resultPayment;

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // traverseRequestId
      // traverseRequestStateId
      // traverseNodeId
      // traverseNodeCommandId

      await this.factorRepository.update(
        {
          traverseRequestId: cartableItem.request.id,
          traverseRequestStateId: cartableItem.requestState.id,
          traverseNodeId: cartableItem.node.id,
          traverseNodeCommandId: cartableItem.nodeCommand.id,
        },
        {
          transaction: transaction,
          where: {
            id: factorDetail.factor.id,
          },
        },
      );

      resultPayment = await this.paymentService.requestPayment({
        factorId: factorDetail.factor.id,
        transaction: transaction,
        userId: user.id,
      });

      // ignore traverse request
      // await this.traverseService.traverse({
      //   request: cartableItem.request,
      //   requestState: cartableItem.requestState,
      //   node: cartableItem.node,
      //   nodeCommand: cartableItem.nodeCommand,
      //   transaction: transaction,
      //   userExecuterId: user.id,
      // });

      // apply changes
      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
        paymentOptions: resultPayment,
      },
    };
  }
}

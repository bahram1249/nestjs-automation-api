import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment, ECWallet } from '@rahino/localdatabase/models';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { LogisticRevertInventoryQtyService } from './logistic-revert-inventory-qty.service';

@Injectable()
export class LogisticRevertPaymentQtyService {
  constructor(
    private readonly revertInventoryQtyService: LogisticRevertInventoryQtyService,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,
  ) {}

  async revertPaymentAndQty(paymentId: bigint) {
    // revert inventories for logistic order structure
    await this.revertInventoryQtyService.revertQty(paymentId);

    // mark main payment failed
    const payment = (
      await this.paymentRepository.update(
        { paymentStatusId: PaymentStatusEnum.FailedPayment },
        { where: { id: paymentId }, returning: true },
      )
    )[1][0];

    // revert child wallet payments back to wallet
    const childPayments = await this.paymentRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ parentPaymentId: payment.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );

    for (let index = 0; index < childPayments.length; index++) {
      const childPayment = childPayments[index];
      const refundPrice = Number(childPayment.totalprice) / 10; // convert to toman similar to legacy

      await this.paymentRepository.create({
        paymentGatewayId: childPayment.paymentGatewayId,
        paymentTypeId: childPayment.paymentTypeId,
        paymentStatusId: PaymentStatusEnum.RefundAmountOfWallet,
        totalprice: childPayment.totalprice,
        logisticOrderId: childPayment.logisticOrderId,
        userId: childPayment.userId,
        parentPaymentId: childPayment.id,
      });

      const wallet = await this.walletRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: payment.userId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('ECWallet.isDeleted'), 0),
              { [Op.eq]: 0 },
            ),
          )
          .build(),
      );

      wallet.currentAmount = BigInt(Number(wallet.currentAmount) + refundPrice);
      wallet.suspendedAmount = BigInt(
        Number(wallet.suspendedAmount) - refundPrice,
      );
      await wallet.save();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { RevertInventoryQtyService } from './revert-inventory-qty.service';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { ECWallet } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class RevertPaymentQtyService {
  constructor(
    private readonly revertInventoryQtyService: RevertInventoryQtyService,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,
  ) {}

  async revertPaymentAndQty(paymentId) {
    await this.revertInventoryQtyService.revertQty(paymentId);
    const payment = (
      await this.paymentRepository.update(
        { paymentStatusId: PaymentStatusEnum.FailedPayment },
        { where: { id: paymentId }, returning: true },
      )
    )[1][0];

    // if the payment has child revert those to wallets

    const childPayments = await this.paymentRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ parentPaymentId: payment.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    for (let index = 0; index < childPayments.length; index++) {
      const childPayment = childPayments[index];
      const refundPrice = Number(childPayment.totalprice) / 10;

      const refundPayment = await this.paymentRepository.create({
        paymentGatewayId: childPayment.paymentGatewayId,
        paymentTypeId: childPayment.paymentTypeId,
        paymentStatusId: PaymentStatusEnum.RefundAmountOfWallet,
        totalprice: childPayment.totalprice,
        orderId: childPayment.orderId,
        userId: childPayment.userId,
        parentPaymentId: childPayment.id,
      });

      const wallet = await this.walletRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: payment.userId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('ECWallet.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
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

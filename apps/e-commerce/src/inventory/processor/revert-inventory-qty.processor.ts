import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { REVERT_INVENTORY_QTY_QUEUE } from '../constants';
import { DBLogger } from '@rahino/logger';
import { RevertInventoryQtyService } from '../services';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/util/enum';
import { Op, Sequelize } from 'sequelize';
import { PaymentServiceManualProviderFactory } from '@rahino/ecommerce/user/payment/provider/factory/payment-service-manual-provider.factory';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';

@Processor(REVERT_INVENTORY_QTY_QUEUE)
export class RevertInventoryQtyProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,
    private readonly revertInventoryQtyService: RevertInventoryQtyService,
    private readonly paymentServiceManualProviderFactory: PaymentServiceManualProviderFactory,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.paymentId) {
      return Promise.reject('paymentId not provided!');
    }
    const paymentId = job.data.paymentId;
    try {
      let payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: paymentId })
          .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
          .filter({ paymentTypeId: PaymentTypeEnum.ForOrder })
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
      if (payment) {
        const paymentService =
          await this.paymentServiceManualProviderFactory.create(
            payment.paymentGatewayId,
          );
        const eligbleToRevert = await paymentService.eligbleToRevert(
          payment.id,
        );
        if (eligbleToRevert) {
          await this.revertInventoryQtyService.revertQty(paymentId);
          payment = (
            await this.paymentRepository.update(
              { paymentStatusId: PaymentStatusEnum.FailedPayment },
              { where: { id: payment.id }, returning: true },
            )
          )[1][0];

          // if the payment has child revert those to wallets

          const childPayments = await this.paymentRepository.findAll(
            new QueryOptionsBuilder()
              .filter({ parentPaymentId: payment.id })
              .filter(
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('ECPayment.isDeleted'),
                    0,
                  ),
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

            let wallet = await this.walletRepository.findOne(
              new QueryOptionsBuilder()
                .filter({ userId: payment.userId })
                .filter(
                  Sequelize.where(
                    Sequelize.fn(
                      'isnull',
                      Sequelize.col('ECWallet.isDeleted'),
                      0,
                    ),
                    {
                      [Op.eq]: 0,
                    },
                  ),
                )
                .build(),
            );

            wallet.currentAmount = BigInt(
              Number(wallet.currentAmount) + refundPrice,
            );
            wallet.suspendedAmount = BigInt(
              Number(wallet.suspendedAmount) - refundPrice,
            );
            await wallet.save();
          }
        }
      }
    } catch (error) {
      return Promise.reject(paymentId);
    }

    return Promise.resolve(paymentId);
  }
}

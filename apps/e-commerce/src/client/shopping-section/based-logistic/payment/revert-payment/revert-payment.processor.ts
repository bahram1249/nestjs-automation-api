import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import { LOGISTIC_REVERT_PAYMENT_QUEUE } from './revert-payment.constants';
import { LogisticRevertPaymentQtyService } from '../../inventory/services/logistic-revert-payment-qty.service';

@Processor(LOGISTIC_REVERT_PAYMENT_QUEUE)
export class LogisticRevertPaymentProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly revertPaymentQtyService: LogisticRevertPaymentQtyService,
    private readonly seqHelp: SequelizeHelpService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>): Promise<any> {
    if (!job.data.paymentId) {
      return Promise.reject('paymentId not provided!');
    }
    const paymentId = job.data.paymentId;
    try {
      const payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: paymentId })
          .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
          .filter(
            this.seqHelp.whereIsNullColumnEqualToZero('ECPayment.isDeleted', 0),
          )
          .build(),
      );
      if (payment) {
        await this.revertPaymentQtyService.revertPaymentAndQty(
          payment.id as any,
        );
      }
    } catch (error) {
      return Promise.reject(paymentId);
    }

    return Promise.resolve(paymentId);
  }
}

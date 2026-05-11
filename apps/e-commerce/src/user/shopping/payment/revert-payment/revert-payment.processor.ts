import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DBLogger } from '@rahino/logger';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { Op, Sequelize } from 'sequelize';
import { REVERT_PAYMENT_QUEUE } from './revert-payment.constants';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Processor(REVERT_PAYMENT_QUEUE)
export class RevertPaymentProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly seqHelp: SequelizeHelpService,
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
          .filter(
            this.seqHelp.whereIsNullColumnEqualToZero('ECPayment.isDeleted', 0),
          )
          .build(),
      );
      if (payment) {
        payment.paymentStatusId = PaymentStatusEnum.FailedPayment;
        payment = await payment.save();
      }
    } catch (error) {
      return Promise.reject(paymentId);
    }

    return Promise.resolve(paymentId);
  }
}

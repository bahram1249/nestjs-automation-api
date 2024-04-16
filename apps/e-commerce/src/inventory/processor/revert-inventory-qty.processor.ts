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

@Processor(REVERT_INVENTORY_QTY_QUEUE)
export class RevertInventoryQtyProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly revertInventoryQtyService: RevertInventoryQtyService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.paymentId) {
      return Promise.reject('paymentId not provided!');
    }
    const paymentId = job.data.paymentId;
    try {
      const payment = await this.paymentRepository.findOne(
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
        await this.revertInventoryQtyService.revertQty(paymentId);
      }
    } catch (error) {
      return Promise.reject(paymentId);
    }

    return Promise.resolve(paymentId);
  }
}

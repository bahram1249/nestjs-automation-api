import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GSSadadPaymentService } from '@rahino/guarantee/shared/payment/sadad';
import { GSPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class GSPaymentServiceManualProviderFactory {
  constructor(
    @InjectModel(GSPaymentGateway)
    private readonly paymentGatewayRepository: typeof GSPaymentGateway,
    private readonly sadadPaymentService: GSSadadPaymentService,
  ) {}

  async create(paymentServiceId: number) {
    const paymentGatewayId = paymentServiceId;
    const payment = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder().filter({ id: paymentGatewayId }).build(),
    );
    if (!payment) {
      throw new BadRequestException('the payment method is not defined');
    }
    switch (payment.serviceProvider) {
      case 'GSSadadPaymentService':
        return this.sadadPaymentService;

      default:
        throw new NotFoundException(`Invalid data source`);
    }
  }
}

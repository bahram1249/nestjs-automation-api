import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GSTransaction } from '@rahino/localdatabase/models';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSTransactionStatusEnum } from '../shared/transaction-status';
import { SadadVerifyDto } from '../shared/payment/sadad/dto';
import { GSSadadPaymentService } from '../shared/payment/sadad';
import { FactorFinalizedService } from '../shared/factor-finalized';

@Injectable()
export class GSPaymentService {
  constructor(
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    private readonly configService: ConfigService,
    private readonly sadadPaymentService: GSSadadPaymentService,
    private readonly factorFinalizedService: FactorFinalizedService,
  ) {}

  async sadadVerfiy(dto: SadadVerifyDto, res: Response) {
    let transactionItem = await this.transactionRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.OrderId })
        .filter({ token: dto.Token })
        .filter({
          transactionStatusId: GSTransactionStatusEnum.WaitingForPayment,
        })
        .build(),
    );

    if (!transactionItem) {
      throw new BadRequestException('invalid transactionId');
    }

    if (Number(dto.ResCode) != 0) {
      transactionItem.transactionStatusId = GSTransactionStatusEnum.UnPaid;
      await transactionItem.save();
      res.redirect(
        302,
        `this.configService.get('BASE_FRONT_URL')/transactionStatus/${transactionItem.id}`,
      );
    }

    const paymentResult = await this.sadadPaymentService.verify(
      dto,
      transactionItem,
    );
    if (!paymentResult) {
      transactionItem.transactionStatusId = GSTransactionStatusEnum.UnPaid;
      await transactionItem.save();
      res.redirect(
        302,
        `this.configService.get('BASE_FRONT_URL')/transactionStatus/${transactionItem.id}`,
      );
    }

    transactionItem.transactionStatusId = GSTransactionStatusEnum.Paid;
    await transactionItem.save();

    await this.factorFinalizedService.finalized(transactionItem.factorId);

    res.redirect(
      302,
      `this.configService.get('BASE_FRONT_URL')/transactionStatus/${transactionItem.id}`,
    );
  }
}

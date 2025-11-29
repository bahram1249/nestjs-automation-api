import { User } from '@rahino/database';
import { PayInterface } from '../interface';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { Op, Sequelize, Transaction } from 'sequelize';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ConfigService } from '@nestjs/config';
import { ECPayment } from '@rahino/localdatabase/models';
import axios from 'axios';
import { ZarinPalDto } from '@rahino/ecommerce/verify-payment/dto';
import { ECOrder } from '@rahino/localdatabase/models';
import { FinalizedPaymentService } from '../../util/finalized-payment/finalized-payment.service';
import { RevertPaymentQtyService } from '@rahino/ecommerce/shared/inventory/services/revert-payment-qty.service';

export class ZarinPalService implements PayInterface {
  private baseUrl = '';
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGateway: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly config: ConfigService,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    private readonly revertInventoryQtyService: RevertPaymentQtyService,
    private readonly finalizedPaymentService: FinalizedPaymentService,
  ) {
    this.baseUrl = 'https://api.zarinpal.com';
    //this.baseUrl = 'https://sandbox.zarinpal.com';
  }
  async eligbleToRevert(paymentId: bigint): Promise<boolean> {
    return true;
  }
  async requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    orderId?: bigint,
    orderDetails?: ECOrderDetail[],
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    const paymentGateway = await this.paymentGateway.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'ZarinPalService' })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!paymentGateway) {
      throw new BadRequestException('invalid payment');
    }

    let payment = await this.paymentRepository.create(
      {
        paymentGatewayId: paymentGateway.id,
        paymentTypeId: paymentType,
        paymentStatusId: PaymentStatusEnum.WaitingForPayment,
        totalprice: totalPrice * 10,
        orderId: orderId,
        userId: user.id,
        paymentVersion: 1,
      },
      {
        transaction: transaction,
      },
    );

    const baseUrl = this.config.get('BASE_URL');

    const data = {
      merchant_id: paymentGateway.username,
      callback_url: baseUrl + '/v1/api/ecommerce/verifyPayments/zarinpal',
      amount: totalPrice * 10,
      metadata: {
        mobile: user.phoneNumber,
      },
      description: 'برای شماره تراکنش ' + payment.id,
    };

    try {
      const requestTransaction = await axios.post(
        this.baseUrl + '/pg/v4/payment/request.json',
        data,
      );
      if (requestTransaction.status < 200 || requestTransaction.status > 299) {
        throw new BadRequestException('invalid payment');
      }

      payment = (
        await this.paymentRepository.update(
          {
            paymentToken: requestTransaction.data.data.authority,
          },
          {
            where: {
              id: payment.id,
            },
            transaction: transaction,
            returning: true,
          },
        )
      )[1][0];
      return {
        redirectUrl:
          'https://www.zarinpal.com' +
          '/pg/StartPay/' +
          requestTransaction.data.data.authority,
        paymentId: payment.id,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `something failed in payments requests:${error.message}`,
      );
    }
  }

  async eligbleRequest(
    totalPrice: number,
    user?: User,
  ): Promise<{
    eligibleCheck: boolean;
    titleMessage?: string;
    description?: string;
  }> {
    return {
      eligibleCheck: true,
      titleMessage: 'پرداخت نقدی با زرین پال',
      description: 'پرداخت مستقیم با تمامی کارت های عضو شتاب',
    };
  }

  async verify(res: any, query: ZarinPalDto) {
    const paymentGateway = await this.paymentGateway.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'ZarinPalService' })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!paymentGateway) {
      throw new BadRequestException('invalid payment');
    }

    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentToken: query.Authority })
        .filter({ paymentGatewayId: paymentGateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException('invalid payment');
    }

    if (query.Status != 'OK') {
      // revert qty
      if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
        await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
      }
    } else {
      const verifyRequest = await axios.post(
        this.baseUrl + '/pg/v4/payment/verify.json',
        {
          authority: query.Authority,
          amount: payment.totalprice,
          merchant_id: paymentGateway.username,
        },
      );
      if (verifyRequest.data.data.code == 100) {
        await this.finalizedPaymentService.successfulZarinPal(
          payment.id,
          verifyRequest.data.data.ref_id,
          verifyRequest.data.data.card_pan,
          verifyRequest.data.data.card_hash,
        );
      } else {
        if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
          // revert qty
          await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
        }
      }
    }
    const frontUrl = this.config.get('BASE_FRONT_URL');
    return res.redirect(
      301,
      frontUrl + `/payment/transaction?transactionId=${payment.id}`,
    );
  }
}

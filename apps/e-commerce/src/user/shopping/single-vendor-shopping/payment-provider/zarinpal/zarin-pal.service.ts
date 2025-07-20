import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SingleVendorPayInterface } from '../interface';
import { User } from '@rahino/database';
import { SingleVendorRequestPaymentDto } from '../dto';
import { ECPayment, ECPaymentGateway } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import axios from 'axios';

@Injectable()
export class SingleVendorZarinPalService implements SingleVendorPayInterface {
  private baseUrl = '';
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGateway: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = 'https://api.zarinpal.com';
    //this.baseUrl = 'https://sandbox.zarinpal.com';
  }

  async requestPayment(
    dto: SingleVendorRequestPaymentDto,
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    if (dto.convertToRial) {
      dto.totalPrice = dto.totalPrice * 10;
      dto.discountAmount = dto.discountAmount * 10;
      dto.shipmentAmount = dto.shipmentAmount * 10;
    }

    const paymentGateway = await this.findZarinPalPaymentGateway();
    let payment = await this.paymentRepository.create(
      {
        paymentGatewayId: paymentGateway.id,
        paymentTypeId: dto.paymentType,
        paymentStatusId: PaymentStatusEnum.WaitingForPayment,
        totalprice: dto.totalPrice,
        orderId: dto.orderId,
        userId: dto.user.id,
      },
      {
        transaction: dto.transaction,
      },
    );

    const baseUrl = this.config.get('BASE_URL');

    const data = {
      merchant_id: paymentGateway.username,
      callback_url: baseUrl + '/v1/api/ecommerce/verifyPayments/zarinpal',
      amount: dto.totalPrice,
      metadata: {
        mobile: dto.user.phoneNumber,
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
            transaction: dto.transaction,
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
        `something failed in payments requests: ${error.message}`,
      );
    }
  }

  eligbleRequest(
    totalPrice: number,
    user?: User,
  ): Promise<{
    eligibleCheck: boolean;
    titleMessage?: string;
    description?: string;
  }> {
    throw new Error('Method not implemented.');
  }
  eligbleToRevert(paymentId: bigint): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private async findZarinPalPaymentGateway() {
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
    return paymentGateway;
  }
}

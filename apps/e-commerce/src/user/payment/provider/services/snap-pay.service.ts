import { User } from '@rahino/database/models/core/user.entity';
import { PayInterface } from '../interface';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/util/enum';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Transaction } from 'sequelize';
import { Op } from 'sequelize';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { Base64 } from 'base64-string';
import axios from 'axios';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { SnapPayDto } from '@rahino/ecommerce/verify-payment/dto';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RevertInventoryQtyService } from '@rahino/ecommerce/inventory/services';

export class SnapPayService implements PayInterface {
  private baseUrl = '';
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGateway: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    private readonly config: ConfigService,
    private readonly revertInventoryQtyService: RevertInventoryQtyService,
  ) {
    this.baseUrl =
      'https://fms-gateway-staging.apps.public.okd4.teh-1.snappcloud.io';
  }
  async requestPayment(
    totalPrice: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    orderId?: bigint,
    orderDetails?: ECOrderDetail[],
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    const paymentGateway = await this.paymentGateway.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'SnapPayService' })
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
    try {
      const token = await this.generateToken(paymentGateway);
      const eligeble = await axios.get(
        this.baseUrl + `/api/online/offer/v1/eligible?amount=${totalPrice}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (eligeble.data.successful != true) {
        throw new BadRequestException('invalid to use this payment gateway');
      }

      let payment = await this.paymentRepository.create(
        {
          paymentGatewayId: paymentGateway.id,
          paymentTypeId: paymentType,
          paymentStatusId: PaymentStatusEnum.WaitingForPayment,
          totalPrice: totalPrice * 10,
          orderId: orderId,
          userId: user.id,
        },
        {
          transaction: transaction,
        },
      );

      const baseUrl = this.config.get('BASE_URL');
      const finalRequetData = {
        amount: totalPrice * 10,
        cartList: [
          {
            cartId: orderId,
            cartItems: orderDetails.map((orderDetail) => {
              return {
                id: orderDetail.id,
                amount: Number(orderDetail.productPrice) * 10,
                count: orderDetail.qty,
                name: orderDetail.product.title,
                category: orderDetail.product.entityType.name,
                totalAmount: Number(orderDetail.totalPrice) * 10,
              };
            }),
            isShipmentIncluded: true,
            isTaxIncluded: true,
          },
        ],
        mobile: user.phoneNumber,
        paymentMethodTypeDto: 'INSTALLMENT',
        returnURL: baseUrl + '/v1/api/ecommerce/verifyPayments/snappay',
        transactionId: payment.id,
      };

      const finalRequest = await axios.post(
        this.baseUrl + '/api/online/payment/v1/token',
        finalRequetData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (finalRequest.data.successful != true) {
        throw new InternalServerErrorException('invalid payment Request');
      }

      payment = (
        await this.paymentRepository.update(
          {
            paymentToken: finalRequest.data.response.paymentToken,
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
        redirectUrl: finalRequest.data.response.paymentPageUrl,
        paymentId: payment.id,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something failed in payment');
    }
  }

  async verify(res: Response, query: SnapPayDto) {
    const paymentGateway = await this.paymentGateway.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'SnapPayService' })
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

    let payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: query.transactionId })
        .filter({ paymentGatewayId: paymentGateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException('invalid payment');
    }

    if (query.state == 'FAILED') {
      payment = (
        await this.paymentRepository.update(
          { paymentStatusId: PaymentStatusEnum.FailedPayment },
          { where: { id: payment.id }, returning: true },
        )
      )[1][0];
      // revert qty
      await this.revertInventoryQtyService.revertQty(payment.id);
    } else if (query.state == 'OK') {
      if (Number(query.amount) == Number(payment.totalprice)) {
        const token = await this.generateToken(paymentGateway);

        const result = await axios.post(
          this.baseUrl + '/api/online/payment/v1/verify',
          {
            paymentToken: payment.paymentToken,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        );
        if (result.data.successful != true) {
          throw new BadRequestException('invalid payment');
        }
        if (result.data.response.transactionId != payment.id.toString()) {
          throw new BadRequestException('invalid payment');
        }
        const finalRequest = await axios.post(
          this.baseUrl + '/api/online/payment/v1/settle',
          {
            paymentToken: payment.paymentToken,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        );
        if (finalRequest.data.successful == true) {
          payment = (
            await this.paymentRepository.update(
              { paymentStatusId: PaymentStatusEnum.SuccessPayment },
              {
                where: {
                  id: payment.id,
                },
                returning: true,
              },
            )
          )[1][0];
          await this.orderRepository.update(
            { orderStatusId: OrderStatusEnum.Paid },
            {
              where: {
                id: payment.orderId,
              },
            },
          );
        }
      }
    }
    const frontUrl = this.config.get('BASE_FRONT_URL');
    return res.redirect(
      301,
      frontUrl + `/payment/transaction?transaction=${payment.id}`,
    );
  }

  private async generateToken(paymentGateway: ECPaymentGateway) {
    const clientId = paymentGateway.username;
    if (!clientId) {
      throw new InternalServerErrorException('clientId not provided');
    }
    const clientSecret = paymentGateway.password;
    if (!clientSecret) {
      throw new InternalServerErrorException('secret not provided');
    }
    const base64 = new Base64();
    const authorization =
      'Basic ' + base64.encode(`${clientId}:${clientSecret}`);

    const tokenResponse = await axios.post(
      this.baseUrl + '/api/online/v1/oauth/token',
      {},
      {
        headers: {
          Authorization: authorization,
        },
      },
    );
    if (tokenResponse.status < 200 || tokenResponse.status > 299) {
      throw new InternalServerErrorException('invalid token');
    }
    const token = tokenResponse.data.access_token;
    return token;
  }
}

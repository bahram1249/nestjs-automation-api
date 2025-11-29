import {
  Injectable,
  Scope,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Sequelize, Transaction, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECPaymentGateway,
  ECPayment,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { User } from '@rahino/database';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { LogisticPayInterface } from '../interface/logistic-pay.interface';
import { LogisticRevertPaymentQtyService } from '../../../inventory/services/logistic-revert-payment-qty.service';
import { LogisticFinalizedPaymentService } from '../../util/finalized-payment/logistic-finalized-payment.service';
import { Base64 } from 'base64-string';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable({ scope: Scope.REQUEST })
export class LogisticSnapPayService implements LogisticPayInterface {
  private baseUrl = 'https://api.snapppay.ir';
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepo: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepo: typeof ECPayment,
    private readonly config: ConfigService,
    private readonly revertInventoryQtyService: LogisticRevertPaymentQtyService,
    private readonly finalizedPaymentService: LogisticFinalizedPaymentService,
    private readonly l10n: LocalizationService,
  ) {}

  async requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    logisticOrderId?: bigint,
    groupedDetails?: ECLogisticOrderGroupedDetail[],
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    const gateway = await this.findGateway('SnapPayService');
    const token = await this.generateToken(gateway);

    // Eligibility check (rial)
    const elig = await axios.get(
      `${this.baseUrl}/api/online/offer/v1/eligible?amount=${totalPrice * 10}`,
      { headers: { Authorization: 'Bearer ' + token } },
    );
    if (
      elig.data?.successful !== true &&
      elig.data?.response?.eligible !== true
    ) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }

    const transactionId = await this.generateUniqueTransactionId();

    let payment = await this.paymentRepo.create(
      {
        paymentGatewayId: gateway.id,
        paymentTypeId: paymentType,
        paymentStatusId: PaymentStatusEnum.WaitingForPayment,
        totalprice: totalPrice * 10, // store in rial
        logisticOrderId: logisticOrderId,
        userId: user.id,
        transactionId: transactionId,
        paymentVersion: 2,
      },
      { transaction },
    );

    const baseUrl = this.config.get('BASE_URL');
    let phoneNumber = user.phoneNumber;
    if (phoneNumber?.startsWith('0')) {
      phoneNumber = '+98' + phoneNumber.substring(1);
    }

    const cartItems = (groupedDetails ?? []).map((d) => ({
      id: d.id,
      amount: Number(d.productPrice) * 10,
      count: Number(d.qty),
      name: (d as any)?.product?.title || `Item-${d.id}`,
      category: (d as any)?.product?.entityType?.name || 'Logistic',
      commissionType: 100,
    }));

    const totalItemsAmount = cartItems
      .map((i) => i.amount * i.count)
      .reduce((a, b) => a + b, 0);

    const finalRequetData = {
      amount: totalPrice * 10,
      cartList: [
        {
          cartId: logisticOrderId,
          cartItems,
          isShipmentIncluded: true,
          shippingAmount: shipmentAmount * 10,
          isTaxIncluded: true,
          taxAmount: 0,
          totalAmount: totalItemsAmount + shipmentAmount * 10,
        },
      ],
      discountAmount: discountAmount * 10,
      mobile: phoneNumber,
      paymentMethodTypeDto: 'INSTALLMENT',
      externalSourceAmount: 0,
      returnURL: baseUrl + '/v1/api/ecommerce/verifyPayments/snappay',
      transactionId: payment.transactionId,
    };

    const finalRequest = await axios.post(
      this.baseUrl + '/api/online/payment/v1/token',
      finalRequetData,
      { headers: { Authorization: 'Bearer ' + token } },
    );
    if (finalRequest.data?.successful !== true) {
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.invalid_payment_request'),
      );
    }

    payment = (
      await this.paymentRepo.update(
        { paymentToken: finalRequest.data.response.paymentToken },
        { where: { id: payment.id }, transaction, returning: true },
      )
    )[1][0];

    return {
      redirectUrl: finalRequest.data.response.paymentPageUrl,
      paymentId: payment.id,
    };
  }

  async eligbleRequest(totalPrice: number, user?: User) {
    try {
      const gateway = await this.findGateway('SnapPayService');
      const token = await this.generateToken(gateway);
      const elig = await axios.get(
        `${this.baseUrl}/api/online/offer/v1/eligible?amount=${totalPrice * 10}`,
        { headers: { Authorization: 'Bearer ' + token } },
      );
      const ok =
        elig.data?.response?.eligible === true ||
        elig.data?.successful === true;
      return {
        eligibleCheck: !!ok,
        titleMessage: elig.data?.response?.title_message,
        description: elig.data?.response?.description,
      };
    } catch {
      return { eligibleCheck: false, titleMessage: null, description: null };
    }
  }

  async eligbleToRevert(paymentId: bigint): Promise<boolean> {
    const gateway = await this.findGateway('SnapPayService');

    // find payment that is still waiting
    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter({ paymentGatewayId: gateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }

    const token = await this.generateToken(gateway);

    // 1) check status; if api fails, allow revert
    try {
      const statusRequest = await axios.get(
        `${this.baseUrl}/api/online/payment/v1/status?paymentToken=${payment.paymentToken}`,
        { headers: { Authorization: 'Bearer ' + token }, timeout: 60000 },
      );
      if (statusRequest.data?.successful === false) {
        return true;
      }
    } catch {
      return true;
    }

    // 2) verify; if fails or transaction mismatch, allow revert
    try {
      const result = await axios.post(
        this.baseUrl + '/api/online/payment/v1/verify',
        { paymentToken: payment.paymentToken },
        { headers: { Authorization: 'Bearer ' + token }, timeout: 60000 },
      );
      if (result.data?.successful !== true) {
        return true;
      }
      if (
        result.data.response.transactionId != payment.transactionId?.toString()
      ) {
        return true;
      }
    } catch {
      return true;
    }

    // 3) settle; if settles successfully we finalize and return false (not eligible for revert)
    const finalRequest = await axios.post(
      this.baseUrl + '/api/online/payment/v1/settle',
      { paymentToken: payment.paymentToken },
      { headers: { Authorization: 'Bearer ' + token }, timeout: 60000 },
    );
    if (finalRequest.data?.successful === true) {
      // mark success via finalized payment service
      await this.finalizedPaymentService.successfulSnapPay(payment.id);
      return false;
    }
    return true;
  }

  async verify(
    res: any,
    query: { transactionId: string; state: string; amount: string },
  ) {
    const gateway = await this.findGateway('SnapPayService');
    if (!gateway)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );

    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ transactionId: query.transactionId })
        .filter({ paymentGatewayId: gateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );

    if (query.state === 'FAILED') {
      await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
    } else if (query.state === 'OK') {
      if (Number(query.amount) === Number(payment.totalprice)) {
        const token = await this.generateToken(gateway);
        const result = await axios.post(
          this.baseUrl + '/api/online/payment/v1/verify',
          { paymentToken: payment.paymentToken },
          { headers: { Authorization: 'Bearer ' + token }, timeout: 60000 },
        );
        if (result.data?.successful !== true) {
          await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
          throw new BadRequestException(
            this.l10n.translate('ecommerce.invalid_payment'),
          );
        }
        if (
          result.data.response.transactionId != payment.transactionId.toString()
        ) {
          await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
          throw new BadRequestException(
            this.l10n.translate('ecommerce.invalid_payment'),
          );
        }
        const finalRequest = await axios.post(
          this.baseUrl + '/api/online/payment/v1/settle',
          { paymentToken: payment.paymentToken },
          { headers: { Authorization: 'Bearer ' + token }, timeout: 60000 },
        );
        if (finalRequest.data?.successful === true) {
          await this.finalizedPaymentService.successfulSnapPay(payment.id);
        }
      }
    }
    const frontUrl = this.config.get('BASE_FRONT_URL');
    return res.redirect(
      301,
      frontUrl + `/payment/transaction?transactionId=${payment.id}`,
    );
  }

  private async findGateway(serviceName: string) {
    const gateway = await this.paymentGatewayRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!gateway)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    return gateway;
  }

  private async generateToken(gateway: ECPaymentGateway): Promise<string> {
    const clientId = (gateway as any).clientId;
    if (!clientId)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.client_id_not_provided'),
      );
    const clientSecret = (gateway as any).secret;
    if (!clientSecret)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.secret_not_provided'),
      );

    const username = (gateway as any).username;
    if (!username)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.username_not_provided'),
      );
    const password = (gateway as any).password;
    if (!password)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.password_not_provided'),
      );

    const base64 = new Base64();
    const authorization =
      'Basic ' + base64.encode(`${clientId}:${clientSecret}`);

    const tokenResponse = await axios.post(
      this.baseUrl + '/api/online/v1/oauth/token',
      {
        grant_type: 'password',
        scope: 'online-merchant',
        username: username,
        password: password,
      },
      {
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (tokenResponse.status < 200 || tokenResponse.status > 299) {
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.invalid_token'),
      );
    }
    const token = tokenResponse.data?.access_token;
    if (!token)
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.invalid_token_body'),
      );
    return token;
  }

  async update(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    phoneNumber: string,
    transaction?: Transaction,
    logisticOrderId?: bigint,
    groupedDetails?: ECLogisticOrderGroupedDetail[],
  ) {
    const gateway = await this.findGateway('SnapPayService');
    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ logisticOrderId: logisticOrderId })
        .filter({ paymentGatewayId: gateway.id })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }

    let phone = phoneNumber;
    if (phone?.startsWith('0')) {
      phone = '+98' + phone.substring(1);
    }

    const token = await this.generateToken(gateway);

    const cartItems = (groupedDetails ?? []).map((d) => ({
      id: d.id,
      amount: Number(d.productPrice || 0) * 10,
      count: Number(d.qty || 0),
      name: (d as any)?.product?.title || `Item-${d.id}`,
      category: (d as any)?.product?.entityType?.name || 'Logistic',
      commissionType: 100,
    }));
    const totalItemsAmount = cartItems
      .map((i) => i.amount * i.count)
      .reduce((a, b) => a + b, 0);

    const finalRequetData = {
      amount: totalPrice * 10,
      cartList: [
        {
          cartId: logisticOrderId,
          cartItems,
          isShipmentIncluded: true,
          shippingAmount: shipmentAmount * 10,
          isTaxIncluded: true,
          taxAmount: 0,
          totalAmount: totalItemsAmount + shipmentAmount * 10,
        },
      ],
      discountAmount: discountAmount * 10,
      mobile: phone,
      paymentMethodTypeDto: 'INSTALLMENT',
      externalSourceAmount: 0,
      transactionId: payment.transactionId,
      paymentToken: payment.paymentToken,
    } as any;

    const finalRequest = await axios.post(
      this.baseUrl + '/api/online/payment/v1/update',
      finalRequetData,
      { headers: { Authorization: 'Bearer ' + token } },
    );
    if (finalRequest.data?.successful !== true) {
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.invalid_payment_request'),
      );
    }

    await this.paymentRepo.update(
      { totalprice: totalPrice * 10 },
      { where: { id: payment.id }, transaction },
    );
    return { result: payment };
  }

  async cancel(logisticOrderId: bigint, transaction?: Transaction) {
    const gateway = await this.findGateway('SnapPayService');

    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ logisticOrderId })
        .filter({ paymentGatewayId: gateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.SuccessPayment })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }
    const token = await this.generateToken(gateway);
    const finalRequest = await axios.post(
      this.baseUrl + '/api/online/payment/v1/cancel',
      { paymentToken: payment.paymentToken },
      { headers: { Authorization: 'Bearer ' + token } },
    );
    if (finalRequest.data?.successful !== true) {
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.invalid_payment_request'),
      );
    }

    await this.paymentRepo.update(
      { paymentStatusId: PaymentStatusEnum.Refund },
      { where: { id: payment.id }, transaction },
    );
    return payment;
  }

  private async generateUniqueTransactionId(): Promise<string> {
    // similar logic to legacy: epoch seconds, ensure uniqueness
    while (true) {
      const id = Math.floor(Date.now() / 1000).toString();
      const exists = await this.paymentRepo.findOne(
        new QueryOptionsBuilder().filter({ transactionId: id }).build(),
      );
      if (!exists) return id;
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

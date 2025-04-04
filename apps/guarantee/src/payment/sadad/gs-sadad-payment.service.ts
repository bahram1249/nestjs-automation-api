import { BadRequestException, Injectable } from '@nestjs/common';
import { GSPaymentInterface } from '../interface/gs-payment.interface';
import { GSRequestPaymentDto } from '../dto/gs-request-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSFactor,
  GSPaymentGateway,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';
import * as CryptoJS from 'crypto-js';
import {
  GSSadadRequestPaymentDto,
  GSSadadRequestPaymentOutputDto,
} from './dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GSRequestPaymentOutputDto } from '../dto/gs-request-payment-output.dto';
import { GSRequestPaymentOutputTypeEnum } from '../dto/gs-request-payment-output-type.dto';

@Injectable()
export class GSSadadPaymentService implements GSPaymentInterface {
  constructor(
    @InjectModel(GSFactor) private readonly factorRepository: typeof GSFactor,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    @InjectModel(GSPaymentGateway)
    private readonly paymentGatewayRepository: typeof GSPaymentGateway,
    private readonly configService: ConfigService,
  ) {}
  async requestPayment(
    dto: GSRequestPaymentDto,
  ): Promise<GSRequestPaymentOutputDto> {
    const factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.factorId })
        .filter({ factorStatusId: GSFactorStatusEnum.WaitingForPayment })
        .transaction(dto.transaction)
        .build(),
    );
    if (!factor)
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );

    // rial
    const totalAmountOfFactor = await this.getRialAmount(factor);

    const transactions = await this.transactionRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ factorId: dto.factorId })
        .filter({ transactionStatusId: GSTransactionStatusEnum.Paid })
        .transaction(dto.transaction)
        .build(),
    );

    // rial
    const transactionTotalPrices = transactions.map((transaction) =>
      transaction.unitPriceId == GSUnitPriceEnum.Toman
        ? Number(transaction.totalPrice)
        : Number(transaction.totalPrice) * 10,
    );

    // rial
    let paidUntilNow = transactionTotalPrices.reduce(
      (prev, current) => prev + current,
      0,
    );
    const mustPaid = totalAmountOfFactor - paidUntilNow;

    // find gateway
    const gateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceProvider: 'GSSadadPaymentService' })
        .build(),
    );
    if (!gateway) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );
    }

    const transaction = await this.transactionRepository.create(
      {
        transactionStatusId: GSTransactionStatusEnum.WaitingForPayment,
        unitPriceId: GSUnitPriceEnum.Rial,
        totalPrice: mustPaid,
        factorId: dto.factorId,
        userId: dto.userId,
        paymentGatewayId: gateway.id,
      },
      { transaction: dto.transaction },
    );
    // request to sadad using axios
    const res = await this.requestToSadad(transaction, gateway);

    await this.transactionRepository.update(
      { token: res.Token },
      {
        where: {
          id: transaction.id,
        },
        transaction: dto.transaction,
      },
    );

    return {
      redirectType: GSRequestPaymentOutputTypeEnum.RedirectBase,
      data: null,
      redirectUrl: `https://sadad.shaparak.ir/Purchase/Index?token=${res.Token}`,
    };
  }

  private async requestToSadad(
    transaction: GSTransaction,
    gateway: GSPaymentGateway,
  ): Promise<GSSadadRequestPaymentOutputDto> {
    const payload: GSSadadRequestPaymentDto = {
      Amount: Number(transaction.totalPrice),
      MerchantId: gateway.merchantId,
      OrderId: transaction.id,
      TerminalId: gateway.terminalId,
      SignData: this.encryptTripleDES_ECB_PKCS7(
        `${gateway.terminalId};${transaction.id};${transaction.totalPrice}`,
        gateway.merchantKey,
      ),
      LocalDateString: new Date().toISOString(),
      ReturnUrl: `${this.configService.get(
        'BASE_URL',
      )}/v1/api/guarantee/payments/sadad/verifyCallback`,
    };
    const res = await axios.post(
      'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
      payload,
    );
    return res.data as GSSadadRequestPaymentOutputDto;
  }

  private async getRialAmount(factor: GSFactor) {
    return factor.unitPriceId == GSUnitPriceEnum.Toman
      ? Number(factor.totalPrice) * 10
      : Number(factor.totalPrice);
  }

  private encryptTripleDES_ECB_PKCS7(plainText: string, key: string): string {
    // Convert key to WordArray
    const keyHex = CryptoJS.enc.Utf8.parse(key);

    // Check key length (TripleDES requires 24 bytes)
    if (keyHex.sigBytes !== 24) {
      throw new Error('Key must be 24 bytes (192 bits) for TripleDES');
    }

    // Encrypt
    const encrypted = CryptoJS.TripleDES.encrypt(plainText, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Return as Base64 string
    return encrypted.toString();
  }
}

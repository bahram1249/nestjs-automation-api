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
  SadadVerifyDto,
  SadadVerifyMethodDto,
  SadadVerifyOutputDto,
} from './dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GSRequestPaymentOutputDto } from '../dto/gs-request-payment-output.dto';
import { GSRequestPaymentOutputTypeEnum } from '../dto/gs-request-payment-output-type.dto';
import { Op, Sequelize } from 'sequelize';
import { RialPriceService } from '@rahino/guarantee/shared/rial-price';

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
    private readonly rialPriceService: RialPriceService,
  ) {}
  async requestPayment(
    dto: GSRequestPaymentDto,
  ): Promise<GSRequestPaymentOutputDto> {
    const factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.factorId })
        .filter({ factorStatusId: GSFactorStatusEnum.WaitingForPayment })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .transaction(dto.transaction)
        .build(),
    );
    if (!factor)
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );

    // rial
    const totalAmountOfFactor = this.rialPriceService.getRialPrice({
      price: Number(factor.totalPrice),
      unitPriceId: factor.unitPriceId,
    });

    const transactions = await this.transactionRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ factorId: dto.factorId })
        .filter({ transactionStatusId: GSTransactionStatusEnum.Paid })
        .transaction(dto.transaction)
        .build(),
    );

    // rial

    const transactionTotalPrices = transactions.map((transaction) =>
      this.rialPriceService.getRialPrice({
        price: Number(transaction.totalPrice),
        unitPriceId: transaction.unitPriceId,
      }),
    );

    // rial
    const paidUntilNow = transactionTotalPrices.reduce(
      (prev, current) => prev + current,
      0,
    );
    const mustPaid = totalAmountOfFactor - paidUntilNow;
    if (mustPaid <= 0) {
      return {
        redirectType: GSRequestPaymentOutputTypeEnum.RedirectBase,
        data: null,
        redirectUrl: `${this.configService.get('BASE_FRONT_URL')}`,
      };
    }
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

    let transaction = await this.transactionRepository.create(
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

    transaction.signData = this.encryptPKCS7(
      `${gateway.terminalId};${transaction.id};${transaction.totalPrice}`,
      gateway.merchantKey,
    );
    transaction = await transaction.save({ transaction: dto.transaction });

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
      redirectUrl: `${this.configService.get(
        'BASE_URL',
      )}/v1/api/guarantee/client/redirector/sadad?token=${res.Token}`,
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
      SignData: transaction.signData,
      LocalDateString: new Date().toISOString(),
      ReturnUrl: `${this.configService.get(
        'BASE_URL',
      )}/v1/api/guarantee/payments/sadad/verifyCallback`,
    };
    const res = await axios.post(
      'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
      payload,
    );
    console.log('payload:', payload);
    console.log('response:', res.data);
    return res.data as GSSadadRequestPaymentOutputDto;
  }

  private encryptPKCS7(str: string, base64Key: string): string {
    // Decode the Base64 encoded key
    const key = CryptoJS.enc.Base64.parse(base64Key);

    // Encrypt using TripleDES (DES-EDE3) in ECB mode with PKCS7 padding
    const encrypted = CryptoJS.TripleDES.encrypt(str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Return the ciphertext as Base64 string
    return encrypted.toString();
  }

  public async verify(dto: SadadVerifyDto, transactionItem: GSTransaction) {
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

    const payload: SadadVerifyMethodDto = {
      Token: dto.token,
      SignData: this.encryptPKCS7(dto.token, gateway.merchantKey),
    };

    console.log('payload', payload);
    const res = await axios.post(
      'https://sadad.shaparak.ir/api/v0/Advice/Verify',
      payload,
    );

    console.log('data return from sadad', res.data);
    const result = res.data as SadadVerifyOutputDto;

    if (Number(result.ResCode) != 0) return false;
    if (result.Amount != Number(transactionItem.totalPrice)) return false;

    // if you want store extra data from ipg

    return true;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import { PayInterface } from '../interface';
import { User } from '@rahino/database/models/core/user.entity';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/util/enum';
import { Sequelize, Transaction } from 'sequelize';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { FinalizedPaymentService } from '../../util/finalized-payment/finalized-payment.service';
import { ConfigService } from '@nestjs/config';
import { PaymentServiceManualWalletPurposeProviderFactory } from '../factory/payment-service-manual-wallet-purpose-provider.factory';

export class WalletService implements PayInterface {
  constructor(
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGateway: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    private readonly finalizedPaymentService: FinalizedPaymentService,
    private readonly paymentServiceProvider: PaymentServiceManualWalletPurposeProviderFactory,
    private readonly config: ConfigService,
  ) {}
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
        .filter({ serviceName: 'WalletService' })
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

    const wallet = await this.walletRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .transaction(transaction)
        .build(),
    );
    if (!wallet) {
      throw new BadRequestException("the main wallet isn't found");
    }

    // toman

    if (wallet.currentAmount >= totalPrice) {
      const currentWalletAmount = wallet.currentAmount - BigInt(totalPrice);
      await this.walletRepository.update(
        { currentAmount: currentWalletAmount },
        {
          where: {
            id: wallet.id,
          },
          transaction: transaction,
        },
      );
      let payment = await this.paymentRepository.create(
        {
          paymentGatewayId: paymentGateway.id,
          paymentTypeId: paymentType,
          paymentStatusId: PaymentStatusEnum.DecreaseAmountOfWallet,
          totalprice: totalPrice * 10,
          orderId: orderId,
          userId: user.id,
        },
        {
          transaction: transaction,
        },
      );

      await this.finalizedPaymentService.successfulWallet(
        payment.id,
        transaction,
      );

      const frontUrl = this.config.get('BASE_FRONT_URL');

      return {
        paymentId: payment.id,
        redirectUrl: `${frontUrl}/user/orders/${payment.orderId}`,
      };
    } else {
      const paymentGateway = await this.paymentGateway.findOne(
        new QueryOptionsBuilder()
          .filter({ eligibleChargeWallet: true })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECPaymentGateway.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!paymentGateway) {
        throw new ForbiddenException('the payment for charging not founded!');
      }
      const mustBePaid = totalPrice - Number(wallet.currentAmount);

      // we must send (must be paid) instead of total price

      const paymentService = await this.paymentServiceProvider.create(
        paymentGateway.id,
      );
      const paymentResult = await paymentService.requestPayment(
        mustBePaid,
        0,
        0,
        user,
        paymentType,
        transaction,
        orderId,
        orderDetails,
      );

      if (mustBePaid != totalPrice) {
        const walletPayment = await this.paymentRepository.create(
          {
            paymentGatewayId: paymentGateway.id,
            paymentTypeId: paymentType,
            paymentStatusId: PaymentStatusEnum.DecreaseAmountOfWallet,
            totalprice: Number(wallet.currentAmount) * 10,
            orderId: orderId,
            userId: user.id,
            parentPaymentId: paymentResult.paymentId,
          },
          {
            transaction: transaction,
          },
        );

        // update current wallet of amount
        await this.walletRepository.update(
          {
            suspendedAmount: wallet.suspendedAmount + wallet.currentAmount,
            currentAmount: wallet.currentAmount - wallet.currentAmount,
          },
          {
            where: {
              id: wallet.id,
            },
            transaction: transaction,
          },
        );
      }

      return {
        paymentId: paymentResult.paymentId,
        redirectUrl: paymentResult.redirectUrl,
      };
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
    if (!user) {
      return {
        eligibleCheck: false,
        titleMessage: 'پرداخت با کیف پول',
        description: '',
      };
    }
    const wallet = await this.walletRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
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
    if (!wallet) {
      throw new BadRequestException("the main wallet isn't found");
    }
    return {
      eligibleCheck: true,
      titleMessage: 'پرداخت با کیف پول',
      description: `موجودی کیف پول شما (${wallet.currentAmount.toLocaleString()}) تومان هست`,
    };
  }
}

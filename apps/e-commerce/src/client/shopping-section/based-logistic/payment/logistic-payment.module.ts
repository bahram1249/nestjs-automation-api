import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DBLoggerModule } from '@rahino/logger';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { AddressModule } from '@rahino/ecommerce/user/address/address.module';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { LogisticPaymentProviderModule } from './provider/logistic-payment-provider.module';
import { ApplyDiscountModule } from '@rahino/ecommerce/shared/apply-discount';
import { LogisticPaymentRuleModule } from '../payment-rule/logistic-payment-rule.module';
import { ClientShipmentPriceModule } from '../shipment-price/shipment-price.module';
import { ClientLogisticPeriodModule } from '../logistic-period/logistic-period.module';
import { LogisticPaymentController } from './logistic-payment.controller';
import { LogisticPaymentService } from './logistic-payment.service';
import { PersianDate, User } from '@rahino/database';
import {
  ECInventoryPrice,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECPaymentGateway,
  ECProduct,
  EAVEntityType,
  ECStock,
  ECVendorCommission,
  ECVariationPrice,
  ECPayment,
  ECWallet,
} from '@rahino/localdatabase/models';
import { StockModule } from '@rahino/ecommerce/user/shopping/stock/stock.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { LOGISTIC_REVERT_PAYMENT_QUEUE } from './revert-payment/revert-payment.constants';
import { LogisticRevertPaymentProcessor } from './revert-payment/revert-payment.processor';
import { LogisticRevertInventoryModule } from '../inventory/logistic-revert-inventory.module';
import { LogisticRevertPaymentQtyService } from '../inventory/services/logistic-revert-payment-qty.service';
import { LogisticPaymentGatewaysService } from './logistic-payment-gateways.service';
import { LogisticWalletModule } from './provider/wallet.module';

@Module({
  imports: [
    LocalizationModule,
    DBLoggerModule,
    SessionModule,
    AddressModule,
    ProductModule,
    QueryFilterModule,
    ApplyDiscountModule,
    LogisticPaymentRuleModule,
    LogisticPaymentProviderModule,
    LogisticWalletModule,
    ClientShipmentPriceModule,
    ClientLogisticPeriodModule,
    StockModule,
    LogisticRevertInventoryModule,
    BullModule.registerQueueAsync({
      name: LOGISTIC_REVERT_PAYMENT_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    SequelizeModule.forFeature([
      User,
      PersianDate,
      ECStock,
      ECProduct,
      EAVEntityType,
      ECPaymentGateway,
      ECVariationPrice,
      ECInventoryPrice,
      ECVendorCommission,
      ECPayment,
      ECWallet,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
    ]),
  ],
  controllers: [LogisticPaymentController],
  providers: [
    LogisticPaymentService,
    LogisticRevertPaymentProcessor,
    LogisticRevertPaymentQtyService,
    LogisticPaymentGatewaysService,
  ],
  exports: [LogisticPaymentService],
})
export class ClientLogisticPaymentModule {}

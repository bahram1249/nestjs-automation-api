import { Module } from '@nestjs/common';
import { LogisticPeriodController } from './logistic-period.controller';
import { LogisticPeriodService } from './logistic-period.service';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { DBLoggerModule } from '@rahino/logger';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersianDate, User } from '@rahino/database';
import {
  ECLogisticOrderGrouped,
  ECLogisticShipmentWay,
  ECStock,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { AddressModule } from '@rahino/ecommerce/user/address/address.module';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { ClientValidateAddressModule } from '../validate-address/client-validate-address.module';
import { ClientShipmentPriceModule } from '../shipment-price/shipment-price.module';

@Module({
  imports: [
    LocalizationModule,
    ClientValidateAddressModule,
    ClientShipmentPriceModule,
    SequelizeModule.forFeature([
      User,
      ECStock,
      PersianDate,
      ECLogisticShipmentWay,
      ECLogisticOrderGrouped,
    ]),
    AddressModule,
    SessionModule,
    QueryFilterModule,
    ProductModule,
    DBLoggerModule,
  ],
  controllers: [LogisticPeriodController],
  providers: [LogisticPeriodService],
  exports: [LogisticPeriodService],
})
export class ClientLogisticPeriodModule {}

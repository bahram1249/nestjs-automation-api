import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProductModule as AdminProductModule } from './admin/product/product.module';
import { LoginModule } from './user/login/login.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BrandModule } from './brand/brand.module';
import { ColorModule } from './color/color.module';
import { GuaranteeModule } from './guarantee/guarantee.module';
import { GuaranteeMonthModule } from './guarantee-month/guarantee-month.module';
import { PublishStatusModule } from './publish-status/publish-status.module';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { AddressModule } from './user/address/address.module';
import { ProductPhotoModule } from './product-photo/product-photo.module';
import { ProductImageRemovalModule } from './product-image-removal/product-image-removal.module';
import { ProductImageRemovalService } from './product-image-removal/product-image-removal.service';
import { VendorModule } from './vendor/vendor.module';
import { UserVendorModule } from './user/vendor/user-vendor.module';
import { VendorAddressModule } from './vendor-address/vendor-address.module';
import { SessionModule } from './user/session/session.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging/interceptor';
import { BullModule } from '@nestjs/bullmq';
import { REQUEST_LOGGING_QUEUE } from './logging/constants';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from './logging/logging.module';
import { ProductModule } from './product/product.module';
import { DiscountTypeModule } from './admin/discount-type/discount-type.module';
import { DiscountActionTypeModule } from './admin/discount-action-type/discount-action-type.module';
import { DiscountActionRuleModule } from './admin/discount-action-rule/discount-action-rule.module';
import { DiscountModule } from './admin/discount/discount.module';
import { DiscountConditionTypeModule } from './admin/discount-condition-type/discount-condition-type.module';
import { DiscountConditionValueModule } from './admin/discount-condition-value/discount-condition-value.module';
import { DiscountConditionModule } from './admin/discount-condition/discount-condition.module';
import { StockModule } from './user/stock/stock.module';
import { PaymentModule } from './user/payment/payment.module';
import { VerifyPaymentModule } from './verify-payment/verify-payment.module';
import { TransactionModule } from './user/transaction/transaction.module';
import { TransactionModule as AdminTransactionModule } from './admin/transaction/transaction.module';
import { PostageFeeModule } from './admin/postage-fee/postage-fee.module';
import { PendingOrderModule } from './admin/pendingOrder/pending-order.module';
import { PostageOrderModule } from './admin/postageOrder/postage-order.module';
import { TotalOrderModule } from './admin/totalOrders/total-order.module';
import { UserOrderModule } from './user/order/user-order.module';
import { CourierModule } from './admin/courier/courier.module';
import { CourierPriceModule } from './admin/courier-price/courier-price.module';
import { CourierOrderModule } from './admin/courierOrder/courier-order.module';
import { DeliveryOrderModule } from './admin/deliveryOrder/delivery-order.module';
import { ProductDiscountModule } from './product-discount/product-discount.module';
import { ProductDiscountJobRunnerService } from './product-discount/product-discount-job-runner.service';

@Module({
  imports: [
    LoggingModule,
    BullModule.registerQueueAsync({
      name: REQUEST_LOGGING_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    LoginModule,
    SessionModule,
    BrandModule,
    ColorModule,
    GuaranteeModule,
    GuaranteeMonthModule,
    PublishStatusModule,
    ProvinceModule,
    CityModule,
    NeighborhoodModule,
    AddressModule,
    ProductPhotoModule,
    ProductImageRemovalModule,
    VendorModule,
    UserVendorModule,
    VendorAddressModule,
    AdminProductModule,
    ProductModule,
    DiscountModule,
    DiscountTypeModule,
    DiscountActionTypeModule,
    DiscountActionRuleModule,
    DiscountConditionTypeModule,
    DiscountConditionValueModule,
    DiscountConditionModule,
    StockModule,
    PaymentModule,
    VerifyPaymentModule,
    TransactionModule,
    AdminTransactionModule,
    PostageFeeModule,
    PendingOrderModule,
    PostageOrderModule,
    TotalOrderModule,
    UserOrderModule,
    CourierModule,
    CourierPriceModule,
    CourierOrderModule,
    DeliveryOrderModule,
    ProductDiscountModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class ECommerceModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  async setApp(app: INestApplication<any>) {
    this.app = app;
    const coreConfig = new DocumentBuilder()
      .setTitle('ECommerce Api')
      .setDescription('The ECommerce API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
      include: [ECommerceModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/ecommerce', this.app, coreDocument);

    app.get(ProductImageRemovalService).run();
    app.get(ProductDiscountJobRunnerService).run();
  }
}

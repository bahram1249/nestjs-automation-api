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
import { VariationPriceModule } from './admin/variation-price/variation-price.module';
import { TorobProductModule } from './torob-product/torob-product.module';
import { AdminSaleModule } from './report/admin-sale/admin-sale.module';
import { PersianDateMonthModule } from './persiandate/bymonth/persian-date-month.module';
import { VendorSaleModule } from './report/vendor-sale/vendor-sale.module';
import { AdminCourierReportModule } from './report/admin-courier/admin-courier.module';
import { AdminPostReportModule } from './report/admin-post/admin-post.module';
import { CourierReportModule } from './report/courier/courier-report.module';
import { PaymentTransactionReportModule } from './report/payment-transaction/payment-transaction.module';
import { PaymentGatewayModule } from './admin/payment-gateway/payment-gateway.module';
import { InventoryReportModule } from './report/inventory/inventory-report.module';
import { InventoryStatusModule } from './admin/inventory-status/inventory-status.module';
import { EntityTypeFactorModule } from './admin/entity-type-factor/entity-type-factor.module';
import { ProductCommentModule } from './product-comment/product-comment.module';
import { AdminProductCommentModule } from './admin/product-comment/product-comment.module';
import { ProductCommentStatusModule } from './admin/product-comment-status/product-comment-status.module';
import { OrderStatusModule } from './admin/order-status/order-status.module';
import { OrderShipmentWayModule } from './admin/order-shipmentway/order-shipmentway.module';
import { AdminAddressModule } from './admin/address/address.module';
import { ProductSaleModule } from './report/product-sale/product-sale.module';
import { InventoryHistoryModule } from './admin/inventory-history/inventory-history.module';
import { AdminPageModule } from './admin/page/page.module';
import { PageModule } from './page/page.module';
import { DashboardModule } from './user/dashboard/dashboard.module';
import { CancellOrderModule } from './admin/cancell-order/cancell-order.module';
import { UserCommentModule } from './user/comment/comment.module';
import { ChargingWalletPaymentModule } from './user/charging-wallet-payment/charging-wallet-payment.module';
import { AdminHomePageModule } from './admin/home-page/home-page.module';
import { HomePagePhotoModule } from './admin/home-page-photo/home-page-photo.module';
import { EntityTypeSortModule } from './admin/entity-type-sort/entity-type-sort.module';
import { HomePhotoModule } from './home-photo/home-photo.module';
import { HomePageModule } from './home/home.module';
import { ProcessHomeRunnerService } from './home/process-home-runner.service';
import { ProductVideoModule } from './product-video/product-video.module';
import { ProductVideoRemovalService } from './product-video-removal/product-video-removal.service';
import { ProductFavoriteModule } from './user/product-favorite/product-favorite.module';
import { ProductVideoRemovalModule } from './product-video-removal/product-video-removal.module';
import { AdminNotificationModule } from './admin/notification/notification.module';
import { NotificationModule } from './user/notification/notification.module';
import { AdminHeaderNotificationModule } from './admin/header-notification/notification.module';
import { UserHeaderNotificationModule } from './user/header-notification/notification.module';
import { CustomerCustomizeMoudle } from './customer-customize/customer-customize.module';
import { GoldModule } from './customer-customize/gold/gold.module';
import { FactorDiscountModule } from './admin/factor-discount/factor-discount.module';
import { RetrievePriceRunnerService } from './customer-customize/gold/retrieve-price-job/services';
import { SelectedProductModule } from './admin/selected-product/selected-product.module';
import { SelectedProductItemModule } from './admin/selected-product-items/selected-product-item.module';
import { UserSelectedProductModule } from './user/selected-product/selected-product.module';

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
    ProductVideoRemovalModule,
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
    VariationPriceModule,
    TorobProductModule,
    AdminSaleModule,
    VendorSaleModule,
    AdminCourierReportModule,
    AdminPostReportModule,
    CourierReportModule,
    PersianDateMonthModule,
    PaymentTransactionReportModule,
    PaymentGatewayModule,
    InventoryReportModule,
    InventoryStatusModule,
    EntityTypeFactorModule,
    ProductCommentModule,
    AdminProductCommentModule,
    ProductCommentStatusModule,
    OrderStatusModule,
    OrderShipmentWayModule,
    AdminAddressModule,
    ProductSaleModule,
    InventoryHistoryModule,
    AdminPageModule,
    PageModule,
    DashboardModule,
    CancellOrderModule,
    UserCommentModule,
    ChargingWalletPaymentModule,
    AdminHomePageModule,
    HomePagePhotoModule,
    EntityTypeSortModule,
    HomePhotoModule,
    HomePageModule,
    ProductVideoModule,
    ProductFavoriteModule,
    AdminNotificationModule,
    NotificationModule,
    AdminHeaderNotificationModule,
    UserHeaderNotificationModule,
    CustomerCustomizeMoudle,
    FactorDiscountModule,
    SelectedProductModule,
    SelectedProductItemModule,
    UserSelectedProductModule,
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
      include: [ECommerceModule, GoldModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/ecommerce', this.app, coreDocument);

    // add product image removal job
    app.get(ProductImageRemovalService).run();

    // add product video removal job
    app.get(ProductVideoRemovalService).run();

    // add discount cacher
    app.get(ProductDiscountJobRunnerService).run();

    // add dynamic cacher of home page elements
    app.get(ProcessHomeRunnerService).run();

    // add live price job runner
    await app.get(RetrievePriceRunnerService).run();
  }
}

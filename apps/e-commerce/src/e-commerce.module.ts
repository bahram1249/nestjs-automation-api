import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProductModule as AdminProductModule } from './admin/product-section/product/product.module';
import { LoginModule } from './user/login/login.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BrandModule } from './client/brand/brand.module';
import { ColorModule } from './client/color/color.module';
import { GuaranteeModule } from './client/guarantee/guarantee.module';
import { GuaranteeMonthModule } from './client/guarantee-month/guarantee-month.module';
import { PublishStatusModule } from '@rahino/ecommerce/anonymous/publish-status/publish-status.module';
import { ProvinceModule } from './client/province/province.module';
import { CityModule } from './client/city/city.module';
import { NeighborhoodModule } from './client/neighborhood/neighborhood.module';
import { AddressModule } from './user/address/address.module';
import { ProductPhotoModule } from './admin/product-section/product-photo/product-photo.module';
import { ProductImageRemovalModule } from './job/product-image-removal/product-image-removal.module';
import { ProductImageRemovalService } from './job/product-image-removal/product-image-removal.service';
import { AdminVendorModule } from './admin/vendor/admin-vendor.module';
import { UserVendorModule } from './user/user-vendor/user-vendor.module';
import { VendorAddressModule } from './vendor-address/vendor-address.module';
import { SessionModule } from './user/session/session.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './job/logging/interceptor';
import { BullModule } from '@nestjs/bullmq';
import { REQUEST_LOGGING_QUEUE } from './job/logging/constants';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from './job/logging/logging.module';
import { ProductModule } from './client/product/product.module';
import { DiscountTypeModule } from './admin/discount-section/discount-type/discount-type.module';
import { DiscountActionTypeModule } from './admin/discount-section/discount-action-type/discount-action-type.module';
import { DiscountActionRuleModule } from './admin/discount-section/discount-action-rule/discount-action-rule.module';
import { DiscountModule } from './admin/discount-section/discount/discount.module';
import { DiscountConditionTypeModule } from './admin/discount-section/discount-condition-type/discount-condition-type.module';
import { DiscountConditionValueModule } from './admin/discount-section/discount-condition-value/discount-condition-value.module';
import { DiscountConditionModule } from './admin/discount-section/discount-condition/discount-condition.module';
import { StockModule } from './user/shopping/stock/stock.module';
import { PaymentModule } from './user/shopping/payment/payment.module';
import { VerifyPaymentModule } from './verify-payment/verify-payment.module';
import { TransactionModule } from './user/transaction/transaction.module';
import { TransactionModule as AdminTransactionModule } from './admin/order-section/transaction/transaction.module';
import { PostageFeeModule } from './admin/order-section/postage-fee/postage-fee.module';
import { PendingOrderModule } from './admin/order-section/pendingOrder/pending-order.module';
import { PostageOrderModule } from './admin/order-section/postageOrder/postage-order.module';
import { TotalOrderModule } from './admin/order-section/totalOrders/total-order.module';
import { UserOrderModule } from './user/order/user-order.module';
import { CourierModule } from './admin/order-section/courier/courier.module';
import { CourierPriceModule } from './admin/order-section/courier-price/courier-price.module';
import { CourierOrderModule } from './admin/order-section/courierOrder/courier-order.module';
import { DeliveryOrderModule } from './admin/order-section/deliveryOrder/delivery-order.module';
import { ProductDiscountModule } from './job/product-discount/product-discount.module';
import { VariationPriceModule } from './admin/product-section/variation-price/variation-price.module';
import { TorobProductModule } from './anonymous/torob-product/torob-product.module';
import { AdminSaleModule } from './report/admin-sale/admin-sale.module';
import { BasedAdminSaleReportModule } from './report/based-logistic/admin-sale/admin-sale.module';
import { PersianDateMonthModule } from './client/persiandate/bymonth/persian-date-month.module';
import { VendorSaleModule } from './report/vendor-sale/vendor-sale.module';
import { BasedVendorSaleReportModule } from './report/based-logistic/vendor-sale/vendor-sale.module';
import { AdminCourierReportModule } from './report/admin-courier/admin-courier.module';
import { AdminPostReportModule } from './report/admin-post/admin-post.module';
import { CourierReportModule } from './report/courier/courier-report.module';
import { BasedAdminCourierReportModule } from './report/based-logistic/admin-courier/admin-courier.module';
import { BasedAdminPostReportModule } from './report/based-logistic/admin-post/admin-post.module';
import { BasedCourierReportModule } from './report/based-logistic/courier/courier-report.module';
import { PaymentTransactionReportModule } from './report/payment-transaction/payment-transaction.module';
import { PaymentGatewayModule } from './admin/order-section/payment-gateway/payment-gateway.module';
import { InventoryReportModule } from './report/inventory/inventory-report.module';
import { InventoryStatusModule } from './admin/product-section/inventory-status/inventory-status.module';
import { EntityTypeFactorModule } from './admin/additional-entity-type-section/entity-type-factor/entity-type-factor.module';
import { ProductCommentModule } from './client/product-comment/product-comment.module';
import { AdminProductCommentModule } from './admin/product-section/product-comment/product-comment.module';
import { ProductCommentStatusModule } from './admin/product-section/product-comment-status/product-comment-status.module';
import { OrderStatusModule } from './admin/order-section/order-status/order-status.module';
import { OrderShipmentWayModule } from './admin/order-section/order-shipmentway/order-shipmentway.module';
import { AdminAddressModule } from './admin/address/address.module';
import { ProductSaleModule } from './report/product-sale/product-sale.module';
import { InventoryHistoryModule } from './admin/product-section/inventory-history/inventory-history.module';
import { AdminPageModule } from './admin/page/page.module';
import { PageModule } from './client/page/page.module';
import { DashboardModule } from './user/dashboard/dashboard.module';
import { CancellOrderModule } from './admin/order-section/cancell-order/cancell-order.module';
import { UserCommentModule } from './user/comment/comment.module';
import { ChargingWalletPaymentModule } from './user/charging-wallet-payment/charging-wallet-payment.module';
import { AdminHomePageModule } from './admin/home-page-section/home-page/home-page.module';
import { HomePagePhotoModule } from './admin/home-page-section/home-page-photo/home-page-photo.module';
import { EntityTypeSortModule } from './admin/home-page-section/entity-type-sort/entity-type-sort.module';
import { HomePhotoModule } from './client/home-photo/home-photo.module';
import { HomePageModule } from './client/home/home.module';
import { ProcessHomeRunnerService } from './client/home/process-home-runner.service';
import { ProductVideoModule } from './admin/product-section/product-video/product-video.module';
import { ProductVideoRemovalService } from './job/product-video-removal/product-video-removal.service';
import { ProductFavoriteModule } from './user/product-favorite/product-favorite.module';
import { ProductVideoRemovalModule } from './job/product-video-removal/product-video-removal.module';
import { AdminNotificationModule } from './admin/notification/notification.module';
import { NotificationModule } from './user/notification/notification.module';
import { AdminHeaderNotificationModule } from './admin/home-page-section/header-notification/notification.module';
import { UserHeaderNotificationModule } from './user/header-notification/notification.module';
import { CustomerCustomizeMoudle } from './customer-customize/customer-customize.module';
import { GoldModule } from './customer-customize/gold/gold.module';
import { FactorDiscountModule } from './admin/discount-section/factor-discount/factor-discount.module';
import { RetrievePriceRunnerService } from './customer-customize/gold/retrieve-price-job/services';
import { SelectedProductModule } from './admin/product-section/selected-product/selected-product.module';
import { SelectedProductItemModule } from './admin/product-section/selected-product-items/selected-product-item.module';
import { UserSelectedProductModule } from './user/selected-product/selected-product.module';
import { ClientVendorModule } from './client/vendor/client-vendor.module';
import { AdminLinkedEntityTypeBrandModule } from './admin/additional-entity-type-section/linked-entity-type-brand/linked-entity-type-brand.module';
import { ClientLinkedEntityTypeBrandModule } from './client/linked-entity-type-brand/linked-entity-type-brand.module';
import { AdminPublicPhotoModule } from './admin/public-photo/public-photo.module';
import { ClientPublicPhotoModule } from './client/public-photo/public-photo.module';
import { SingleVendorShoppingCartModule } from './user/shopping/single-vendor-shopping/shopping-cart/shopping-cart.module';
import { ShippingWayModule } from './anonymous/shipping-way/shipping-way.module';
import { AnonymousNearbyVendorModule } from './anonymous/nearby-vendor/nearby-vendor.module';
import { AnonymousVendorEntityTypeModule } from './anonymous/vendor-entity-type/vendor-entity-type.module';
import { AnonymousInventoryStatusModule } from './anonymous/inventory-status/inventory-status.module';
import { AnonymousPaymentGatewayModule } from './anonymous/payment-gateway/payment-gateway.module';
import { SingleVendorPaymentModule } from './user/shopping/single-vendor-shopping/payment';
import { AdminLogisticModule } from './admin/logistic-section/logistic/admin-logistic.module';
import { AdminLogisticUserModule } from './admin/logistic-section/logistic-user/admin-logistic-user.module';
import { AdminLogisticShipmentWayModule } from './admin/logistic-section/logistic-shipment-way/admin-logistic-shipmentway.module';
import { AdminLogisticSendingPeriodModule } from './admin/logistic-section/logistic-sending-period/logistic-sending-period.module';
import { AdminLogisticWeeklyPeriodModule } from './admin/logistic-section/logistic-weekly-period/logistic-weekly-period.module';
import { ScheduleSendingTypeModule } from './admin/logistic-section/schedule-sending-type/schedule-sending-type.module';
import { ClientLogisticPeriodModule } from './client/shopping-section/based-logistic/logistic-period/logistic-period.module';
import { ClientLogisticPaymentModule } from './client/shopping-section/based-logistic/payment/logistic-payment.module';
import { LogisticCourierOrderModule } from './admin/logistic-order-section/courierOrder/logistic-courier-order.module';
import { LogisticPendingOrderModule } from './admin/logistic-order-section/pendingOrder/logistic-pending-order.module';
import { LogisticPostageOrderModule } from './admin/logistic-order-section/postageOrder/logistic-postage-order.module';
import { LogisticDeliveryOrderModule } from './admin/logistic-order-section/deliveryOrder/logistic-delivery-order.module';
import { LogisticCancellOrderModule } from './admin/logistic-order-section/cancell-order/logistic-cancell-order.module';
import { LogisticTotalOrderModule } from './admin/logistic-order-section/totalOrders/logistic-total-order.module';
import { LogisticClientOrderModule } from './client/order/client-order.module';
import { BasedProductSaleModule } from './report/based-logistic/product-sale/product-sale.module';
import { BasedPaymentTransactionModule } from './report/based-logistic/payment-transaction/payment-transaction.module';
import { VendorInventoryModule } from './job/vendor-inventory/vendor-inventory.module';
import { ProductViewModule } from './client/product-view/product-view.module';

@Module({
  imports: [
    ProductViewModule,
    VendorInventoryModule,
    BasedProductSaleModule,
    BasedPaymentTransactionModule,
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
    AdminVendorModule,
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
    BasedAdminSaleReportModule,
    VendorSaleModule,
    BasedVendorSaleReportModule,
    AdminCourierReportModule,
    AdminPostReportModule,
    CourierReportModule,
    BasedAdminCourierReportModule,
    BasedAdminPostReportModule,
    BasedCourierReportModule,
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
    ClientVendorModule,
    AdminLinkedEntityTypeBrandModule,
    ClientLinkedEntityTypeBrandModule,
    AdminPublicPhotoModule,
    ClientPublicPhotoModule,

    SingleVendorShoppingCartModule,
    ShippingWayModule,
    AnonymousNearbyVendorModule,
    AnonymousVendorEntityTypeModule,
    AnonymousInventoryStatusModule,
    AnonymousPaymentGatewayModule,
    SingleVendorPaymentModule,

    AdminLogisticModule,
    AdminLogisticUserModule,
    AdminLogisticShipmentWayModule,
    AdminLogisticSendingPeriodModule,
    AdminLogisticWeeklyPeriodModule,
    ScheduleSendingTypeModule,

    ClientLogisticPeriodModule,
    ClientLogisticPaymentModule,
    LogisticPendingOrderModule,
    LogisticPostageOrderModule,
    LogisticCourierOrderModule,
    LogisticDeliveryOrderModule,
    LogisticCancellOrderModule,
    LogisticTotalOrderModule,
    LogisticClientOrderModule,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    //app.get(ProductDiscountJobRunnerService).run();

    // add dynamic cacher of home page elements
    app.get(ProcessHomeRunnerService).run();

    // add live price job runner
    await app.get(RetrievePriceRunnerService).run();
  }
}

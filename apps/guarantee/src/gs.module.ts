import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductTypeModule } from './admin/product-type';
import { BrandModule } from './admin/brand';
import { NormalGuaranteeModule } from './admin/normal-guarantee';
import { LoginModule } from './client/login/login.module';
import { SellerSyncModule, SellerSyncService } from './job/seller-sync';
import { VariantModule } from './admin/variant';
import { ClientNormalGuaranteeModule } from './client/normal-guarantee';
import { GSProvinceModule } from './client/province/province.module';
import { GSCityModule } from './client/city/city.module';
import { GSNeighborhoodModule } from './client/neighborhood/neighborhood.module';
import { GSAddressModule } from './client/address/address.module';
import { GuaranteeOrganizationModule } from './admin/guarantee-organization';
import { GuaranteeOrganizationContractModule } from './admin/guarantee-organization-contract';
import { GSAdditionalPackageModule } from './admin/additional-package';
import { GSClientAdditionalPackageModule } from './client/additional-package';
import { GSSolutionModule } from './admin/solution';
import { GSCartableSolutionModule } from './cartable/solution';
import { GSRequestTypeModule } from './client/request-type/request-type.module';
import { GSClientRequestModule } from './client/request/request.module';
import { GSCartableModule } from './admin/cartable';
import { CartableOrganizationModule } from './cartable/organization/organization.module';
import { PickOrganizationModule } from './cartable/pick-organization';
import { RejectModule } from './cartable/reject';
import { LoginSmsSenderModule } from './job/login-sms-sender';
import { NormalGuaranteeRequestSmsSenderModule } from './job/normal-guarantee-request-sms-sender';
import { NewIncomingCartableRequestSmsSenderModule } from './job/new-incoming-cartable-request-sms-sender';
import { CartableHistoryModule } from './cartable/history';
import { CartableAutoTraverseModule } from './cartable/auto-traverse/cartable-auto-traverse.module';
import { GSTechnicalPersonModule } from './admin/technical-person';
import { ClientHistoryModule } from './client/history';
import { GSNeedActionModule } from './client/need-action';
import { GSVipBundleTypeModule } from './admin/vip-bundle-types';
import { ClientVariantModule } from './client/variant';
import { ClientBrandModule } from './client/brand';
import { ClientProductTypeModule } from './client/product-type';
import { TechnicalUserCartableRequestSmsSenderModule } from './job/technical-user-cartable-request-sms-sender';
import { PickTechnicalUserModule } from './cartable/pick-technical-user';
import { ClientTechnicalUserVisitRequestSmsSenderModule } from './job/client-technical-user-visit-request-sms-sender';
import { ConfirmModule } from './cartable/confirm';
import { ClientShippingWayRequestSmsSenderModule } from './job/client-shipping-way-request-sms-sender';
import { ClientOrganizationAddressModule } from './client/organization-address';
import { CartableTechnicalUserModule } from './cartable/technical-user';
import { GSClientShippingWayModule } from './client/shipping-way/shipping-way.module';
import { PickClientShipmentWayModule } from './client/pick-shipment-way';
import { GSPayAdditionalPackageModule } from './client/pay-additional-package/pay-additional-package.module';
import { GSClientOnlinePaymentGatewayModule } from './client/online-payment-gateway';
import { CartableWarrantyServiceTypeModule } from './cartable/warranty-service-type';
import { SubmitSolutionItemInRequestLocationModule } from './cartable/submit-solution-item-in-request-location';
import { PickTechnicalUserInOrganizationModule } from './cartable/pick-technical-user-in-organization';
import { SubmitSolutionItemModule } from './cartable/submit-solution-item';
import { GSCartableFactorDetailAndRemainingAmountModule } from './cartable/factor-detail-and-amount-remaining';
import { SubmitFactorInRequestLocationModule } from './cartable/submit-factor-in-request-location';
import { SubmitFactorModule } from './cartable/submit-factor';
import { RedirectorModule } from './client/redirector/redirector.module';
import { GSClientFactorModule } from './client/factor/client-factor.module';
import { GSCartableFactorModule } from './cartable/cartable-factor/cartable-factor.module';
import { GSVipGeneratorModule } from './admin/vip-generator';
import { VipGeneratorJobModule } from './job/vip-generator-job';
import { ClientVipGuaranteeModule } from './client/vip-guarantee';
import { GSClientAssignedProductAssignedGuaranteeModule } from './client/assigned-product-guarantee/assigned-product-guarantee.module';
import { GSClientFactorDetailAndRemainingAmountModule } from './client/factor-detail-and-amount-remaining';
import { RequestFactorPayModule } from './client/request-factor-pay';
import { GSPaymentModule } from './payment/payment.module';
import { GSClientTransactionModule } from './client/transaction';
import { GSAnonymousVipBundleTypeModule } from './anonymous/vip-bundle-types';
import { GSPayVipBundleModule } from './client/pay-vip-bundle/pay-vip-bundle.module';
import { CartableRequestTypeModule } from './cartable/request-type';
import { GSTrackingRequestModule } from './admin/tracking-request';
import { GSClientQuestionModule } from './client/question/question.module';
import { GSClientSubmitSurveyModule } from './client/submit-survey';
import { GSSuperVisorUserModule } from './admin/super-visor-user';
import { CartableRequestAttachmentModule } from './cartable/request-attachment';
import { GSCartableShippingWayModule } from './cartable/shipping-way/shipping-way.module';
import { PickCartableShipmentWayModule } from './cartable/pick-shipment-way';
import { GSAdminResponseModule } from './admin/response';
import { GSSupplierPersonModule } from './admin/suppliers-person';
import { ConfirmSupplierModule } from './cartable/confirm-supplier';
import { RevertToTechnicalUserModule } from './cartable/revert-to-technical-user';
import { GSAnonymousAttachmentModule } from './anonymous/attachment/attachment.module';
import { AnonymousPreRegistrationOrganizationModule } from './anonymous/pre-registration-organization';
import { AnonymousOrganizationModule } from './anonymous/organization';
import { AdminPreRegistrationOrganizationModule } from './admin/pre-registration-organization';
import { IncomeReportModule } from './report/income-report/income-report.module';
import { UserActionReportModule } from './report/user-action-report/user-action-report.module';
import { ActivityReportModule } from './report/activity-report/activity-report.module';
import { TechnicalPersonReportModule } from './report/technical-person-report/technical-person-report.module';
import { SupplierReportModule } from './report/supplier-report/supplier-report.module';
import { ClientSupplierStateRequestSmsSenderModule } from './job/client-supplier-state-request-sms-sender';
import { ClientTechnicalStateRequestSmsSenderModule } from './job/client-technical-state-request-sms-sender';
import { UserPointModule } from './client/user-point';
import { ClientOnlinePaymentRequestSmsSenderModule } from './job/client-online-payment-request-sms-sender';
import { ClientSurveyRequestSmsSenderModule } from './job/client-online-survey-request-sms-sender';
import { RevertRequestModule } from './cartable/revert-request';
import { AnonymousSubscriptionModule } from './anonymous/subscription';
import { SubscriptionSmsSenderModule } from './job/subscription-sms-sender';
import { GSAdminSubscriptionModule } from './admin/subscription';
import { PreRegistrationInitSmsSenderModule } from './job/pre-registration-init-sms-sender';
import { PreRegistrationSucessSmsSenderModule } from './job/pre-registration-sucess-sms-sender';
import { PreRegistrationRejectDescriptionSmsSenderModule } from './job/pre-registration-reject-description-sms-sender';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import basicAuth from 'express-basic-auth';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnonymousPublicReportModule } from './anonymous/public-report';
import { GSFaqModule } from './admin/faq';
import { GSAnonymousFaqModule } from './anonymous/faq';
import { GSClientProfileModule } from './client/profile/gsprofile.module';
import { ClientSubmitCardSmsSenderModule } from './job/client-submit-card-sms-sender';
import { GSAnonymousCheckModule } from './anonymous/guarantee-check';
import { IrangsImportDataModule } from './admin/irangs-import-data/irangs-import-data.module';
import { ClientReceivingDeviceSmsSenderModule } from './job/client-receiving-device-sms-sender';
import { ConfirmReceiveDeviceInOrganizationModule } from './cartable/confirm-receive-device-in-organization';
import { ThankfullSuccessPaymentSmsSenderModule } from './job/thankfull-success-payment-sms-sender';
import { GSAllActivitiesModule } from './cartable/all-activities';

@Module({
  imports: [
    LoginModule,
    ProductTypeModule,
    BrandModule,
    NormalGuaranteeModule,
    VariantModule,
    ClientNormalGuaranteeModule,
    GSProvinceModule,
    GSCityModule,
    GSNeighborhoodModule,
    GSAddressModule,
    GuaranteeOrganizationModule,
    GuaranteeOrganizationContractModule,
    GSAdditionalPackageModule,
    GSClientAdditionalPackageModule,
    GSSolutionModule,
    GSCartableSolutionModule,
    GSRequestTypeModule,
    GSClientRequestModule,
    GSCartableModule,
    CartableOrganizationModule,
    PickOrganizationModule,
    RejectModule,

    CartableHistoryModule,
    GSTechnicalPersonModule,
    ClientHistoryModule,
    GSNeedActionModule,
    GSVipBundleTypeModule,

    ClientVariantModule,
    ClientBrandModule,
    ClientProductTypeModule,

    PickTechnicalUserModule,

    // Cartable
    ConfirmModule,
    CartableTechnicalUserModule,
    CartableWarrantyServiceTypeModule,
    SubmitSolutionItemInRequestLocationModule,
    PickTechnicalUserInOrganizationModule,
    SubmitSolutionItemModule,
    GSCartableFactorDetailAndRemainingAmountModule,
    SubmitFactorInRequestLocationModule,
    SubmitFactorModule,
    ConfirmReceiveDeviceInOrganizationModule,

    // client
    ClientOrganizationAddressModule,
    GSClientShippingWayModule,
    PickClientShipmentWayModule,

    GSPayAdditionalPackageModule,
    GSClientOnlinePaymentGatewayModule,

    // jobs
    SellerSyncModule,
    LoginSmsSenderModule,
    NormalGuaranteeRequestSmsSenderModule,
    NewIncomingCartableRequestSmsSenderModule,
    TechnicalUserCartableRequestSmsSenderModule,
    ClientTechnicalUserVisitRequestSmsSenderModule,
    ClientShippingWayRequestSmsSenderModule,
    VipGeneratorJobModule,
    ClientSupplierStateRequestSmsSenderModule,
    ClientTechnicalStateRequestSmsSenderModule,
    ClientOnlinePaymentRequestSmsSenderModule,
    ClientSurveyRequestSmsSenderModule,
    ClientReceivingDeviceSmsSenderModule,
    SubscriptionSmsSenderModule,
    PreRegistrationInitSmsSenderModule,
    PreRegistrationSucessSmsSenderModule,
    PreRegistrationRejectDescriptionSmsSenderModule,
    ClientSubmitCardSmsSenderModule,
    ThankfullSuccessPaymentSmsSenderModule,

    // test
    CartableAutoTraverseModule,

    RedirectorModule,

    GSClientFactorModule,
    GSCartableFactorModule,
    GSVipGeneratorModule,

    ClientVipGuaranteeModule,
    GSClientAssignedProductAssignedGuaranteeModule,

    GSClientFactorDetailAndRemainingAmountModule,
    RequestFactorPayModule,
    GSPaymentModule,
    GSClientTransactionModule,

    // Anonymous
    GSAnonymousVipBundleTypeModule,

    GSPayVipBundleModule,
    CartableRequestTypeModule,

    GSTrackingRequestModule,

    GSClientQuestionModule,
    GSClientSubmitSurveyModule,
    GSSuperVisorUserModule,
    CartableRequestAttachmentModule,

    GSCartableShippingWayModule,
    PickCartableShipmentWayModule,
    GSAdminResponseModule,
    GSSupplierPersonModule,
    ConfirmSupplierModule,
    RevertToTechnicalUserModule,

    GSAnonymousAttachmentModule,

    AnonymousPreRegistrationOrganizationModule,
    AnonymousOrganizationModule,

    AdminPreRegistrationOrganizationModule,
    IncomeReportModule,
    UserActionReportModule,
    ActivityReportModule,
    TechnicalPersonReportModule,
    SupplierReportModule,

    UserPointModule,
    RevertRequestModule,

    AnonymousSubscriptionModule,
    GSAdminSubscriptionModule,

    AnonymousPublicReportModule,
    IrangsImportDataModule,

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    GSFaqModule,
    GSAnonymousFaqModule,

    GSClientProfileModule,
    GSAnonymousCheckModule,

    GSAllActivitiesModule,
    // BullBoardModule.forRoot({
    //   route: '/queues',
    //   adapter: ExpressAdapter,
    // }),
  ],
})
export class GSModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  async setApp(app: INestApplication<any>) {
    this.app = app;

    const guaranteeConfig = new DocumentBuilder()
      .setTitle('Guarantee Api')
      .setDescription('The Guarantee API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const guaranteeDocument = SwaggerModule.createDocument(
      this.app,
      guaranteeConfig,
      {
        include: [GSModule],
        deepScanRoutes: true,
      },
    );

    SwaggerModule.setup('api/guarantee', this.app, guaranteeDocument);

    await app.get(SellerSyncService).sync();
  }
}

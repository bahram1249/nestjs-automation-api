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

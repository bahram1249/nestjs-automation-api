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
import { ClientNormalGuaranteeModule } from './client/normal-gurantee';
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

    // jobs
    SellerSyncModule,
    LoginSmsSenderModule,
    NormalGuaranteeRequestSmsSenderModule,
    NewIncomingCartableRequestSmsSenderModule,

    // test
    CartableAutoTraverseModule,
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

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

@Module({
  imports: [
    LoginModule,
    SellerSyncModule,
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

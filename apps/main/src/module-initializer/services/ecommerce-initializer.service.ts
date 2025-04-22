import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { EAVModule } from '@rahino/eav';
import { ECommerceModule } from '@rahino/ecommerce';
import { CoreModule } from '@rahino/core';

@Injectable()
export class ECommerceInitializerService
  implements ModuleInitializerServiceInterface
{
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(EAVModule).setApp(app);
    app.get(ECommerceModule).setApp(app);
  }
}

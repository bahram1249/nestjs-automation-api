import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { BPMNModule } from '@rahino/bpmn';
import { GSModule } from '@rahino/guarantee';
import { CoreModule } from '@rahino/core';

@Injectable()
export class GuaranteeInitializerService
  implements ModuleInitializerServiceInterface
{
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(BPMNModule).setApp(app);
    await app.get(GSModule).setApp(app);
  }
}

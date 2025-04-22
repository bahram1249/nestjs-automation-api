import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { BPMNModule } from '@rahino/bpmn';
import { CoreModule } from '@rahino/core';

@Injectable()
export class BpmnInitializerService
  implements ModuleInitializerServiceInterface
{
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(BPMNModule).setApp(app);
  }
}

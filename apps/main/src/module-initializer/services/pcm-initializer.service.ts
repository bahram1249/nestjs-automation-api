import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { PCMModule } from '@rahino/pcm';
import { CoreModule } from '@rahino/core';

@Injectable()
export class PcmInitializerService
  implements ModuleInitializerServiceInterface
{
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(PCMModule).setApp(app);
  }
}

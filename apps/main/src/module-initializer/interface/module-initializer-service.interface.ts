import { NestExpressApplication } from '@nestjs/platform-express';

export interface ModuleInitializerServiceInterface {
  init(app: NestExpressApplication);
}

import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { EAVModule } from '@rahino/eav';
import { ECommerceModule } from '@rahino/ecommerce';
import { CoreModule } from '@rahino/core';
import { ScriptRunnerService } from '../../script-runner';

@Injectable()
export class ECommerceInitializerService
  implements ModuleInitializerServiceInterface
{
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}

  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(EAVModule).setApp(app);
    app.get(ECommerceModule).setApp(app);
    await this.runScripts();
  }

  private async runScripts() {
    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-V1.sql',
    );
    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-Data.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-Permission.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/EAV/EAV-Table.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/EAV/EAV-Data.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Ecommerce/Ecommerce-Table.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Ecommerce/Ecommerce-Data.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Ecommerce/Ecommerce-EAV-Table.sql',
    );
  }
}

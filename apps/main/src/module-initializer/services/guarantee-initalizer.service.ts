import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { BPMNModule } from '@rahino/bpmn';
import { GSModule } from '@rahino/guarantee';
import { CoreModule } from '@rahino/core';
import { ScriptRunnerService } from '../../script-runner';
import { SellerSyncService } from '@rahino/guarantee/job/seller-sync';

@Injectable()
export class GuaranteeInitializerService
  implements ModuleInitializerServiceInterface
{
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}
  async init(app: NestExpressApplication) {
    app.get(BPMNModule).setApp(app);
    await app.get(GSModule).setApp(app);

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
      './apps/main/src/sql/BPMN/BPMN-Table.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/BPMN/BPMN-Data.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/BPMN/AriaKish-Club-Table.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/BPMN/Ariakish-Club-Data.sql',
    );
  }
}

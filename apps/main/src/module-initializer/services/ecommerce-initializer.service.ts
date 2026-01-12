import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { EAVModule } from '@rahino/eav';
import { ECommerceModule } from '@rahino/ecommerce';
import { CoreModule } from '@rahino/core';
import { ScriptRunnerService } from '../../script-runner';
import { ProductImageRemovalService } from '@rahino/ecommerce/job/product-image-removal/product-image-removal.service';
import { ProductVideoRemovalService } from '@rahino/ecommerce/job/product-video-removal/product-video-removal.service';
import { ProductDiscountJobRunnerService } from '@rahino/ecommerce/job/product-discount/product-discount-job-runner.service';
import { ProcessHomeRunnerService } from '@rahino/ecommerce/client/home/process-home-runner.service';
import { RetrievePriceRunnerService } from '@rahino/ecommerce/customer-customize/gold/retrieve-price-job/services';
@Injectable()
export class ECommerceInitializerService
  implements ModuleInitializerServiceInterface
{
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}

  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(EAVModule).setApp(app);
    app.get(ECommerceModule).setApp(app);

    // add live price job runner
    await app.get(RetrievePriceRunnerService).run();

    // add product image removal job
    await app.get(ProductImageRemovalService).run();

    // add product video removal job
    await app.get(ProductVideoRemovalService).run();

    // add discount cacher
    await app.get(ProductDiscountJobRunnerService).run();

    // add dynamic cacher of home page elements
    await app.get(ProcessHomeRunnerService).run();
  }

  async runOnPrimaryClustred(app: NestExpressApplication) {
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

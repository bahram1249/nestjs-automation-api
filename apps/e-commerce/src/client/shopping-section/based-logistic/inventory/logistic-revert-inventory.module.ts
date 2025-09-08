import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECInventory,
  ECPayment,
  ECProduct,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { LogisticInventoryTrackChangeModule } from '@rahino/ecommerce/shared/inventory-track-change/logistic-inventory-track-change.module';
import { LogisticRevertInventoryQtyService } from './services/logistic-revert-inventory-qty.service';
import { inventoryStatusService } from '@rahino/ecommerce/shared/inventory/services/inventory-status.service';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECInventory,
      ECPayment,
      ECProduct,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
    ]),
    LogisticInventoryTrackChangeModule,
    LocalizationModule,
  ],
  providers: [LogisticRevertInventoryQtyService, inventoryStatusService],
  exports: [LogisticRevertInventoryQtyService],
})
export class LogisticRevertInventoryModule {}

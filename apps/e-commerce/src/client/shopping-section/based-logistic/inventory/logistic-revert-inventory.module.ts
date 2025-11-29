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
import { LogisticDecreaseInventoryQtyService } from './services/logistic-decrease-inventory-qty.service';

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
  providers: [
    LogisticRevertInventoryQtyService,
    LogisticDecreaseInventoryQtyService,
    inventoryStatusService,
  ],
  exports: [
    LogisticRevertInventoryQtyService,
    LogisticDecreaseInventoryQtyService,
  ],
})
export class LogisticRevertInventoryModule {}

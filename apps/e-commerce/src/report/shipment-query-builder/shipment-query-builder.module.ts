import { Module } from '@nestjs/common';
import { ShipmentQueryBuilderService } from './shipment-query-builder.service';

@Module({
  providers: [ShipmentQueryBuilderService],
  exports: [ShipmentQueryBuilderService],
})
export class ShipmentQueryBuilderModule {}

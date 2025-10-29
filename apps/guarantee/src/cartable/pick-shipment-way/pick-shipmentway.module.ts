import { Module } from '@nestjs/common';
import { PickShipmentWayService } from './pick-shipmentway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequest, GSRequestItem } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.module';
import { PickShipmentWayController } from './pick-shipmentway.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest, GSRequestItem]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [PickShipmentWayController],
  providers: [PickShipmentWayService],
  exports: [PickShipmentWayService],
})
export class PickCartableShipmentWayModule {}

import { Module } from '@nestjs/common';
import { AssignedProductGuaranteeController } from './assigned-product-guarantee.controller';
import { AssignedProductGuaranteeService } from './assigned-product-guarantee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSAssignedGuarantee,
  GSAssignedProductAssignedGuarantee,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSAssignedGuarantee,
      GSAssignedProductAssignedGuarantee,
    ]),
    LocalizationModule,
  ],
  controllers: [AssignedProductGuaranteeController],
  providers: [AssignedProductGuaranteeService],
  exports: [AssignedProductGuaranteeService],
})
export class GSClientAssignedProductAssignedGuaranteeModule {}

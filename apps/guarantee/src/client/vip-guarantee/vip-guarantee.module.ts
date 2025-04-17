import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAssignedGuarantee, GSGuarantee } from '@rahino/localdatabase/models';
import { VipGuaranteeService } from './vip-guarantee.service';
import { VipGuaranteeController } from './vip-guarantee.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSGuarantee, GSAssignedGuarantee])],
  controllers: [VipGuaranteeController],
  providers: [VipGuaranteeService],
})
export class ClientVipGuaranteeModule {}

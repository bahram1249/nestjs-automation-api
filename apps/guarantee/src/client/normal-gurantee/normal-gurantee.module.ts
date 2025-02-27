import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAssignedGuarantee, GSGuarantee } from '@rahino/database';
import { NormalGuaranteeService } from './normal-gurantee.service';
import { NormalGuaranteeController } from './normal-gurantee.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSGuarantee, GSAssignedGuarantee])],
  controllers: [NormalGuaranteeController],
  providers: [NormalGuaranteeService],
})
export class ClientNormalGuaranteeModule {}

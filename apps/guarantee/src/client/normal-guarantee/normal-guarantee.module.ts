import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAssignedGuarantee, GSGuarantee } from '@rahino/localdatabase/models';
import { NormalGuaranteeService } from './normal-guarantee.service';
import { NormalGuaranteeController } from './normal-guarantee.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSGuarantee, GSAssignedGuarantee])],
  controllers: [NormalGuaranteeController],
  providers: [NormalGuaranteeService],
})
export class ClientNormalGuaranteeModule {}

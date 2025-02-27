import { Module } from '@nestjs/common';
import { NormalGuaranteeService } from './normal-guarantee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSGuarantee } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { NormalGuaranteeController } from './normal-guarantee.controller';
import { NoramlGuaranteeProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([GSGuarantee, User, Permission])],
  controllers: [NormalGuaranteeController],
  providers: [NormalGuaranteeService, NoramlGuaranteeProfile],
  exports: [NormalGuaranteeService],
})
export class NormalGuaranteeModule {}

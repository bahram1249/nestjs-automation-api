import { Module } from '@nestjs/common';
import { PickOrganizationService } from './pick-organization.service';
import { PickOrganizationController } from './pick-organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    SequelizeModule.forFeature([GSRequest]),
  ],
  controllers: [PickOrganizationController],
  providers: [PickOrganizationService],
  exports: [PickOrganizationService],
})
export class PickOrganizationModule {}

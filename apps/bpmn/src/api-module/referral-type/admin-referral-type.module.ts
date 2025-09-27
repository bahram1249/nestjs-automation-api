import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNReferralType } from '@rahino/localdatabase/models';
import { ReferralTypeController } from './referral-type.controller';
import { ReferralTypeService } from './referral-type.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BPMNReferralType])],
  controllers: [ReferralTypeController],
  providers: [ReferralTypeService],
})
export class AdminReferralTypeModule {}

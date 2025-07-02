import { Module } from '@nestjs/common';
import { GuaranteeMonthController } from './guarantee-month.controller';
import { GuaranteeMonthService } from './guarantee-month.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECGuaranteeMonth])],
  controllers: [GuaranteeMonthController],
  providers: [GuaranteeMonthService],
})
export class GuaranteeMonthModule {}

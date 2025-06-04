import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFaq } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { FaqController } from './faq.controller';
import { FaqProfile } from './mapper';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSFaq, User, Permission]),
    LocalizationModule,
  ],
  controllers: [FaqController],
  providers: [FaqService, FaqProfile],
  exports: [FaqService],
})
export class GSFaqModule {}

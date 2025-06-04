import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFaq } from '@rahino/localdatabase/models';
import { FaqController } from './faq.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([GSFaq]), LocalizationModule],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class GSAnonymousFaqModule {}

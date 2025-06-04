import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSBrand } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { FaqController } from './faq.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSBrand, User, Permission]),
    LocalizationModule,
  ],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class GSAnonymousFaqModule {}

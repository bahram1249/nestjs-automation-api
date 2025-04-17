import { Module } from '@nestjs/common';
import { FactorController } from './client-factor.controller';
import { FactorService } from './client-factor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';
import { GSSuccessFactorQueryBuilderModule } from '@rahino/guarantee/shared/success-factor-query-builder';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSFactor]),
    GSSuccessFactorQueryBuilderModule,
    LocalizationModule,
  ],
  controllers: [FactorController],
  providers: [FactorService],
  exports: [FactorService],
})
export class GSClientFactorModule {}

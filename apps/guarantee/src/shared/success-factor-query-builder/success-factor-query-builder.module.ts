import { Module } from '@nestjs/common';
import { GSSuccessFactorQueryBuilderService } from './success-factor-query-builder.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSFactor])],
  providers: [GSSuccessFactorQueryBuilderService],
  exports: [GSSuccessFactorQueryBuilderService],
})
export class GSSuccessFactorQueryBuilderModule {}

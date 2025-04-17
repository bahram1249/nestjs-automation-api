import { Module } from '@nestjs/common';
import { GSSuccessFactorQueryBuilderService } from './success-factor-query-builder.service';
import { GSSuccessFactorQueryBuilderMapper } from './success-factor-query-builder.mapper';

@Module({
  imports: [],
  providers: [
    GSSuccessFactorQueryBuilderService,
    GSSuccessFactorQueryBuilderMapper,
  ],
  exports: [
    GSSuccessFactorQueryBuilderService,
    GSSuccessFactorQueryBuilderMapper,
  ],
})
export class GSSuccessFactorQueryBuilderModule {}

import { Module } from '@nestjs/common';
import { LogisticOrderQueryBuilderService } from './logistic-order-query-builder.service';

@Module({
  providers: [LogisticOrderQueryBuilderService],
  exports: [LogisticOrderQueryBuilderService],
})
export class LogisticOrderQueryBuilderModule {}

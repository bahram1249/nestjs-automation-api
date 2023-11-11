import { Module } from '@nestjs/common';
import { JsonResponseTransformInterceptor } from './interceptor';

@Module({
  providers: [],
  exports: [JsonResponseTransformInterceptor],
})
export class ResponseModule {}

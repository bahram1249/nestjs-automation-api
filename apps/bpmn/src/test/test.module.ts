import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [RequestModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}

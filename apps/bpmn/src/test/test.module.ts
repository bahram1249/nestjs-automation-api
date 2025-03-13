import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { BPMNRequestModule } from '../modules/request/request.module';

@Module({
  imports: [BPMNRequestModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}

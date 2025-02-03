import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller({
  version: '1',
  path: '/api/bpmn/request',
})
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('/')
  async createRequest() {
    await this.testService.createRequest();
  }
}

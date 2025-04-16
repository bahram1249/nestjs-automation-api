import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SadadRedirectorDto } from './dto';
import { RedirectorService } from './redirector.service';

@Controller({
  path: '/api/guarantee/client/redirector',
  version: ['1'],
})
export class RedirectorController {
  constructor(private service: RedirectorService) {}

  @Get('/sadad')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Query() dto: SadadRedirectorDto) {
    await this.service.sadadRedirector(dto);
  }
}

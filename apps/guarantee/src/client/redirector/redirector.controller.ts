import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { SadadRedirectorDto } from './dto';
import { RedirectorService } from './redirector.service';
import { Response } from 'express';

@Controller({
  path: '/api/guarantee/client/redirector',
  version: ['1'],
})
export class RedirectorController {
  constructor(private service: RedirectorService) {}

  @Get('/sadad')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Query() dto: SadadRedirectorDto, @Res() res: Response) {
    return await this.service.sadadRedirector(dto, res);
  }
}

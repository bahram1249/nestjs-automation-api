import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Render,
} from '@nestjs/common';
import { BuffetService } from './buffet.service';

@Controller({
  path: '/buffet',
})
export class BuffetController {
  constructor(private service: BuffetService) {}
  @Get('/:urlAddress')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/index')
  async get(@Param('urlAddress') urlAddress: string) {
    return await this.service.get(urlAddress);
  }
}

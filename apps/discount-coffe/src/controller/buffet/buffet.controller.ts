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

  @Get('/menus/:urlAddress')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/menus')
  async menus(@Param('urlAddress') urlAddress: string) {
    return await this.service.menus(urlAddress);
  }

  @Get('/:urlAddress')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/index')
  async index(@Param('urlAddress') urlAddress: string) {
    return await this.service.index(urlAddress);
  }
}

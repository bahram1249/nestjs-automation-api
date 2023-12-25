import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { ReserveDto } from './dto';

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

  @Post('/reserve')
  @HttpCode(HttpStatus.CREATED)
  async setReserve(@Body() dto: ReserveDto) {
    return await this.service.setReserve(dto);
  }

  @Get('/completeReserve/:code')
  @HttpCode(HttpStatus.OK)
  async completeReserve(@Param('code') code: string) {
    return await this.service.completeReserve(code);
  }
}

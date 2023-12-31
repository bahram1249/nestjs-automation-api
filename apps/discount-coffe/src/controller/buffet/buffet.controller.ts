import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Render,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { ReserveDto } from './dto';
import { JwtWebGuard } from '@rahino/auth/guard';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { Response, Request } from 'express';

@Controller({
  path: '/buffet',
})
export class BuffetController {
  constructor(private service: BuffetService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/list')
  async list() {
    return await this.service.list();
  }

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

  @UseGuards(JwtWebGuard)
  @Get('/completeReserve/:code')
  @HttpCode(HttpStatus.OK)
  async completeReserve(
    @Req() req: Request,
    @Res() res: Response,
    @GetUser() user: User,
    @Param('code') code: string,
  ) {
    return await this.service.completeReserve(req, res, user, code);
  }

  @UseGuards(JwtWebGuard)
  @Get('/detail/:code')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/detail')
  async detail(@GetUser() user: User, @Param('code') code: string) {
    return await this.service.detail(user, code);
  }

  @Get('/qr/:fileName')
  @HttpCode(HttpStatus.OK)
  async getQr(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return this.service.getQr(res, fileName);
  }
}

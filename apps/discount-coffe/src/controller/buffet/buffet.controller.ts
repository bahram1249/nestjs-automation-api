import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { ReserveDto } from './dto';
import { JwtWebGuard, OptionalJwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { Response, Request } from 'express';
import { BuffetFilterDto } from '@rahino/discountCoffe/api/user/buffet/dto';

@Controller({
  path: '/buffet',
})
export class BuffetController {
  constructor(private service: BuffetService) {}

  @UseGuards(OptionalJwtWebGuard)
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/list')
  async list(@Req() req: Request, @Query() dto: BuffetFilterDto) {
    return await this.service.list(req, dto);
  }

  @UseGuards(OptionalJwtWebGuard)
  @Get('/menus/:urlAddress')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/menus')
  async menus(@Req() req: Request, @Param('urlAddress') urlAddress: string) {
    return await this.service.menus(req, urlAddress);
  }

  @UseGuards(OptionalJwtWebGuard)
  @Get('/:urlAddress')
  @HttpCode(HttpStatus.OK)
  @Render('buffets/index')
  async index(@Req() req: Request, @Param('urlAddress') urlAddress: string) {
    return await this.service.index(req, urlAddress);
  }

  @UseGuards(OptionalJwtWebGuard)
  @Post('/reserve')
  @HttpCode(HttpStatus.CREATED)
  async setReserve(@Req() req: Request, @Body() dto: ReserveDto) {
    return await this.service.setReserve(req, dto);
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

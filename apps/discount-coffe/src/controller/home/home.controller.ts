import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { OptionalJwtWebGuard } from '@rahino/auth/guard';
import { Request } from 'express';

@Controller({
  path: '/',
})
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Get('/')
  @Render('home/index')
  @UseGuards(OptionalJwtWebGuard)
  async index(@Req() req: Request) {
    return await this.service.index(req);
  }
}

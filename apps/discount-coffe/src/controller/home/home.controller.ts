import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { OptionalJwtWebGuard } from '@rahino/auth';
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

  @Get('/aboutus')
  @Render('home/aboutus')
  @UseGuards(OptionalJwtWebGuard)
  async aboutUs(@Req() req: Request) {
    return await this.service.aboutus(req);
  }

  @Get('/contactus')
  @Render('home/contactus')
  @UseGuards(OptionalJwtWebGuard)
  async contacUs(@Req() req: Request) {
    return await this.service.contactus(req);
  }
}

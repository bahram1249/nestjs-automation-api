import { Controller, Get, Render } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller({
  path: '/',
})
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Get('/')
  @Render('home/index')
  async index() {
    return await this.service.index();
  }
}

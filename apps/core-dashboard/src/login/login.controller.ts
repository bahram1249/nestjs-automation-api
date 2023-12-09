import { Controller, Get, Render } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller({
  path: '/core/login',
})
export class LoginController {
  constructor(private readonly service: LoginService) {}

  @Get('/')
  @Render('login/index')
  async get() {
    return { title: 'صفحه ورود' };
  }
}

import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { loginDto } from './dto';
import { Request, Response } from 'express';

@Controller({
  path: '/core/login',
})
export class LoginController {
  constructor(private readonly service: LoginService) {}

  @Get('/')
  @Render('login/index')
  async get() {
    return await this.service.get();
  }

  @Post('/')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: loginDto,
  ) {
    return await this.service.login(req, res, dto);
  }
}

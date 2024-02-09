import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Render,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CodeDto, LoginDto } from './dto';
import { Request, Response } from 'express';

@Controller({
  path: '/login',
})
export class LoginController {
  constructor(private service: LoginService) {}

  // show login page
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('d-login/index')
  async login(@Query('redirectUrl') redirectUrl?: string) {
    return await this.service.login(redirectUrl);
  }

  // send phone number
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async loginRequest(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectUrl') redirectUrl: string = '',
    @Session() session: Record<string, any>,
  ) {
    return await this.service.loginRequest(dto, req, res, redirectUrl, session);
  }

  // show verify code page
  @Get('/code')
  @HttpCode(HttpStatus.OK)
  @Render('d-login/code')
  async verifyCodeIndex(
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectUrl') redirectUrl: string = '',
  ) {
    return await this.service.verifyCodeIndex(session, req, res, redirectUrl);
  }

  // send verify code
  @Post('/verifyCode')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() dto: CodeDto,
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectUrl') redirectUrl: string = '',
  ) {
    return await this.service.verifyCode(dto, session, req, res, redirectUrl);
  }
}

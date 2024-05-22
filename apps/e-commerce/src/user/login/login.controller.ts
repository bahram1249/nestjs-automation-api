import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto, VerifyDto } from './dto';
import { LoginService } from './login.service';

@Controller({
  path: '/api/ecommerce/user/login',
  version: ['1'],
})
export class LoginController {
  constructor(private service: LoginService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.service.login(dto);
  }

  @Post('/verifyCode')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() dto: VerifyDto) {
    return await this.service.verifyCode(dto);
  }
}

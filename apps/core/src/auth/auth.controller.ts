import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, UsernameDto } from './dto';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
  path: '/api/core/auth',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto) {
    return {
      message: 'Success',
      result: await this.authService.signup(dto),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    return {
      result: await this.authService.signin(dto),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('findUser')
  async findUser(@Body() dto: UsernameDto) {
    return await this.authService.findUser(dto);
  }
}

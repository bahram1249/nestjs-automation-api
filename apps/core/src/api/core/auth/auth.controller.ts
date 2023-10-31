import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/api/core/auth')
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
}

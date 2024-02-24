import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '@rahino/auth/decorator';
import { OptionalJwtGuard } from '@rahino/auth/guard';
import { User } from '@rahino/database/models/core/user.entity';
import { SessionService } from './session.service';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';

@UseGuards(OptionalJwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/sessions',
  version: ['1'],
})
export class SessionController {
  constructor(private service: SessionService) {}

  @Get('/generate')
  @HttpCode(HttpStatus.OK)
  async getSession(@GetUser() user?: User) {
    return await this.service.getSession(user);
  }
}

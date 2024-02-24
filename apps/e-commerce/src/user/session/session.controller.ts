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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';

@ApiTags('User-Session')
@UseGuards(OptionalJwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/sessions',
  version: ['1'],
})
export class SessionController {
  constructor(private service: SessionService) {}

  @ApiOperation({
    description:
      'generate or get a session, if user is authenticated, return session based user',
  })
  @Get('/generate')
  @HttpCode(HttpStatus.OK)
  async getSession(
    @GetUser() user?: User,
  ): Promise<Pick<ECUserSession, 'id' | 'userId' | 'expireAt'>> {
    return await this.service.getSession(user);
  }
}

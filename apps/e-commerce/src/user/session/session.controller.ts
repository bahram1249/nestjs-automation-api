import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
import { Throttle } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from '@rahino/commontools/guard';

@ApiTags('User-Session')
@UseGuards(ThrottlerBehindProxyGuard, OptionalJwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/sessions',
  version: ['1'],
})
export class SessionController {
  constructor(private service: SessionService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    description:
      'generate or get a session, if user is authenticated, return session based user',
  })
  @Post('/generate')
  @HttpCode(HttpStatus.OK)
  async getSession(
    @GetUser() user?: User,
  ): Promise<Pick<ECUserSession, 'id' | 'userId' | 'expireAt'>> {
    return await this.service.getSession(user);
  }
}

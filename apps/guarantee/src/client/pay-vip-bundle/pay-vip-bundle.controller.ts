import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PayVipBundleService } from './pay-vip-bundle.service';
import { PayVipBundleDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-PayVipBundle')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/payVipBundles',
  version: ['1'],
})
export class PayVipBundleController {
  constructor(private service: PayVipBundleService) {}

  @ApiOperation({ description: 'create pay vip bundle types by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: PayVipBundleDto) {
    return await this.service.create(user, dto);
  }
}

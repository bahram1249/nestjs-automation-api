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
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { CartableAutoTraverseService } from './cartable-auto-traverse.service';
import { RequestStateIdDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-AutoTraverser')
@Controller({
  path: '/api/guarantee/cartable/bahram/auto-traverse',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CartableAutoTraverseController {
  constructor(private service: CartableAutoTraverseService) {}

  @ApiOperation({ description: 'auto traverse' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: RequestStateIdDto) {
    return await this.service.autoTraverse(user, dto);
  }
}

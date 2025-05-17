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
import { RevertRequestDto } from './dto';
import { User } from '@rahino/database';
import { RevertRequestService } from './revert-request.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RevertRequest')
@Controller({
  path: '/api/guarantee/cartable/revert-request',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RevertRequestController {
  constructor(private service: RevertRequestService) {}

  @ApiOperation({ description: 'revert request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: RevertRequestDto) {
    return await this.service.traverse(user, dto);
  }
}

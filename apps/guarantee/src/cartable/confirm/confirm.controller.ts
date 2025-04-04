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
import { ConfirmRequestDto } from './dto';
import { User } from '@rahino/database';
import { ConfirmService } from './confirm.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Confirm')
@Controller({
  path: '/api/guarantee/cartable/confirm',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ConfirmController {
  constructor(private service: ConfirmService) {}

  @ApiOperation({ description: 'confirm request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: ConfirmRequestDto) {
    return await this.service.traverse(user, dto);
  }
}

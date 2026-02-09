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
import { ConfirmRequestDto, GuaranteeCartableConfirmResponseDto } from './dto';
import { User } from '@rahino/database';
import { ConfirmService } from './confirm.service';
import { ApiJsonResponse } from '@rahino/response';

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
  @ApiJsonResponse({ type: GuaranteeCartableConfirmResponseDto })
  async traverse(@GetUser() user: User, @Body() dto: ConfirmRequestDto) {
    return await this.service.traverse(user, dto);
  }
}

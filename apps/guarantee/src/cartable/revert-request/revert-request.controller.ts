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
import { RevertRequestByHistoryDto } from './dto/revert-request-by-history.dto';
import { ApiJsonResponse } from '@rahino/response';
import { GuaranteeCartableRevertRequestResponseDto } from './dto';

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

  @ApiOperation({ description: 'revert request by history' })
  @ApiJsonResponse({ type: GuaranteeCartableRevertRequestResponseDto })
  @Post('/byHistory')
  @HttpCode(HttpStatus.OK)
  async revertByHistory(
    @GetUser() user: User,
    @Body() dto: RevertRequestByHistoryDto,
  ) {
    return await this.service.revertByHistory(user, dto);
  }

  @ApiOperation({ description: 'revert request' })
  @ApiJsonResponse({ type: GuaranteeCartableRevertRequestResponseDto })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async revertToInit(@GetUser() user: User, @Body() dto: RevertRequestDto) {
    return await this.service.revertToInit(user, dto);
  }
}

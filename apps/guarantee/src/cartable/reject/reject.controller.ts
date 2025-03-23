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
import { RejectDto } from './dto';
import { User } from '@rahino/database';
import { RejectService } from './reject.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Reject')
@Controller({
  path: '/api/guarantee/cartable/reject',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickOrganizationController {
  constructor(private service: RejectService) {}

  @ApiOperation({ description: 'reject request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: RejectDto) {
    return await this.service.traverse(user, dto);
  }
}

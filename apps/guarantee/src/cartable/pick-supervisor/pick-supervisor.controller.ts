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
import { PickSupervisorService } from './pick-supervisor.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-PickSuperVisor')
@Controller({
  path: '/api/guarantee/cartable/pickSupervisor',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickSupervisorController {
  constructor(private service: PickSupervisorService) {}

  @ApiOperation({ description: 'pick supervisor request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: RejectDto) {
    return await this.service.traverse(user, dto);
  }
}

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
import { PickTechnicalUserDto } from './dto';
import { User } from '@rahino/database';
import { PickTechnicalUserService } from './pick-technical-user.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-PickTechnicalUser')
@Controller({
  path: '/api/guarantee/cartable/pickTechnicalUser',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickTechnicalUserController {
  constructor(private service: PickTechnicalUserService) {}

  @ApiOperation({ description: 'pick TechnicalUser request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickTechnicalUserDto) {
    return await this.service.traverse(user, dto);
  }
}

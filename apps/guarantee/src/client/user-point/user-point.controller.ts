import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { UserPointService } from './user-point.service';
import { GetUserPointDto, GuaranteeClientUserPointResponseDto } from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-UserPoint')
@Controller({
  path: '/api/guarantee/client/userPoints',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class UserPointControler {
  constructor(private service: UserPointService) {}

  @ApiOperation({ description: 'show all user point histories' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetUserPointDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeClientUserPointResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetUserPointDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'get total user score' })
  @Get('/totalScore')
  @ApiJsonResponse({ type: Number })
  @HttpCode(HttpStatus.OK)
  async totalScore(@GetUser() user: User) {
    return await this.service.totalScore(user);
  }
}

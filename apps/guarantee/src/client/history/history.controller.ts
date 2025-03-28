import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { HistoryService } from './history.service';
import { GetHistoryDto } from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-History')
@Controller({
  path: '/api/guarantee/client/histories',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class HistoryController {
  constructor(private service: HistoryService) {}

  @ApiOperation({ description: 'show all histories by requestId' })
  @Get('/requestId/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GetHistoryDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Param('requestId') requestId: bigint,
    @Query() filter: GetHistoryDto,
  ) {
    return await this.service.findAll(user, requestId, filter);
  }

  @Get('/latestRequest')
  @HttpCode(HttpStatus.OK)
  async lastRequest(@GetUser() user: User) {
    return await this.service.findByLatestRequest(user);
  }
}

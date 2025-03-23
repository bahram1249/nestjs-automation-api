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
import { JwtGuard } from '@rahino/auth';
import { HistoryService } from './history.service';
import { GetHistoryDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-History')
@Controller({
  path: '/api/guarantee/cartable/histories',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class HistoryController {
  constructor(private service: HistoryService) {}

  @ApiOperation({ description: 'show all solution' })
  @Get('/requestId/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GetHistoryDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GetHistoryDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}

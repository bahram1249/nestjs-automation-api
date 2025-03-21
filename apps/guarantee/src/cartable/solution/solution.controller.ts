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
import { SolutionService } from './solution.service';
import { GetSolutionDto } from './dto';
import { GetSolutionRequestFilterDto } from './dto/get-solution-request-filter.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Solutions')
@Controller({
  path: '/api/guarantee/cartable/solutions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SolutionController {
  constructor(private service: SolutionService) {}

  @ApiOperation({ description: 'show all solution' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSolutionDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSolutionDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show solution by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') entityId: number,
    @Query() filter: GetSolutionRequestFilterDto,
  ) {
    return await this.service.findById(entityId, filter);
  }
}

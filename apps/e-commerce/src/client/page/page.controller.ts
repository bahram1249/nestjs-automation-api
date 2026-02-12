import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageService } from './page.service';
import { ListFilter } from '@rahino/query-filter';
import { PageResponseDto } from './dto';

@ApiTags('Pages')
@Controller({
  path: '/api/ecommerce/pages',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PageController {
  constructor(private service: PageService) {}

  @ApiOperation({ description: 'show total pages' })
  @ApiJsonResponse({ type: PageResponseDto, isArray: true })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show page by given id' })
  @ApiJsonResponse({ type: PageResponseDto })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}

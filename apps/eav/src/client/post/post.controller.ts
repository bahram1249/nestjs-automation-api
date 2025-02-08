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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ListFilter } from '@rahino/query-filter';
import { PostService } from './post.service';

@ApiTags('EAV-Client-Posts')
@Controller({
  path: '/api/eav/client/posts',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PostController {
  constructor(private service: PostService) {}
  @ApiOperation({ description: 'show all posts' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show post value by given id' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}

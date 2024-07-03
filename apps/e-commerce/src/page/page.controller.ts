import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageService } from './page.service';

@ApiTags('Pages')
@Controller({
  path: '/api/ecommerce/pages',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PageController {
  constructor(private service: PageService) {}

  @ApiOperation({ description: 'show page by given id' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}

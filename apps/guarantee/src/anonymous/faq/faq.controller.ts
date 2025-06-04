import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { GetFaqDto } from './dto';

@ApiTags('GS-Faqs')
@Controller({
  path: '/api/guarantee/anonymous/faqs',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class FaqController {
  constructor(private service: FaqService) {}

  @ApiOperation({ description: 'show all faqs' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetFaqDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetFaqDto) {
    return await this.service.findAll(filter);
  }
}

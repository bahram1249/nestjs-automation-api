import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublishStatusService } from './publish-status.service';

@ApiTags('PublishStatuses')
@Controller({
  path: '/api/ecommerce/publishStatuses',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PublishStatusController {
  constructor(private service: PublishStatusService) {}

  // public url
  @ApiOperation({ description: 'show all publish statuses' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}

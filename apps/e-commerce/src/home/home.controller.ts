import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomePageService } from './home.service';
import { OptionalJwtGuard } from '@rahino/auth/guard';
import { OptionalSessionGuard } from '../user/session/guard';

@ApiTags('Home')
@Controller({
  path: '/api/ecommerce/homes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class HomePageController {
  constructor(private service: HomePageService) {}

  // public url

  @ApiOperation({ description: 'show all home sections' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}

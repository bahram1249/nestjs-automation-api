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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { VariantService } from './variant.service';
import { GetVariantDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Variants')
@Controller({
  path: '/api/guarantee/client/variants',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VariantController {
  constructor(private service: VariantService) {}

  @ApiOperation({ description: 'show all brands' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVariantDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVariantDto) {
    return await this.service.findAll(filter);
  }
}

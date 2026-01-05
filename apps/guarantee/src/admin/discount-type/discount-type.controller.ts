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
import { DiscountTypeService } from './discount-type.service';
import { GetDiscountTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-DiscountTypes')
@Controller({
  path: '/api/guarantee/admin/discountTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountTypeController {
  constructor(private service: DiscountTypeService) {}

  @ApiOperation({ description: 'show all discount types' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetDiscountTypeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show discount type by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

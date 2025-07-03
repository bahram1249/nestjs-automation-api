import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { OptionalSessionGuard } from '../../user/session/guard';
import { ProductCommentService } from './product-comment.service';
import { ListFilter } from '@rahino/query-filter';
import { ProductCommentDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Product-Comment')
@UseInterceptors(JsonResponseTransformInterceptor)
@UseGuards(OptionalSessionGuard)
@Controller({
  path: '/api/ecommerce/productComments',
  version: ['1'],
})
export class ProductCommentController {
  constructor(private service: ProductCommentService) {}

  // public url

  @ApiOperation({ description: 'show all possible factors' })
  @Get('/possibleFactor/:productId')
  @HttpCode(HttpStatus.OK)
  async possibleFactors(@Param('productId') productId: bigint) {
    return await this.service.possibleFactors(productId);
  }

  // public url
  @ApiOperation({ description: 'show all product comments' })
  @Get('/product/:id')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('id') productId: bigint, @Query() filter: ListFilter) {
    return await this.service.findAll(productId, filter);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'create comment by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: ProductCommentDto) {
    return await this.service.create(user, dto);
  }
}

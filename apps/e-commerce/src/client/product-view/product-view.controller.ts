import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ProductViewService } from './product-view.service';
import { GetRecentProductDto, ProductViewResponseDto } from './dto';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ApiJsonResponse } from '@rahino/response';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';

@ApiTags('ProductViews - Client')
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/productViews',
  version: ['1'],
})
export class ProductViewController {
  constructor(private readonly service: ProductViewService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all recent products' })
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiJsonResponse({ type: ProductViewResponseDto, isArray: true })
  @HttpCode(HttpStatus.OK)
  @Get('/recent')
  async getRecentProducts(
    @GetUser() user: User,
    @Query() filter: GetRecentProductDto,
  ) {
    return await this.service.getRecentProducts(user, filter);
  }
}

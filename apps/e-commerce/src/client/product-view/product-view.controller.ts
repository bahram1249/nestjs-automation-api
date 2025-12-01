import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ProductViewService } from './product-view.service';
import { GetRecentProductDto } from './dto/get-recent-product.dto';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '@rahino/ecommerce/user/session/guard';

@ApiTags('ProductViews - Client')
@Controller({
  path: '/api/ecommerce/client/productViews',
  version: ['1'],
})
export class ProductViewController {
  constructor(private readonly service: ProductViewService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all recent products' })
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/recent')
  async getRecentProducts(
    @GetUser() user: User,
    @Query() filter: GetRecentProductDto,
  ) {
    return await this.service.getRecentProducts(user, filter);
  }
}

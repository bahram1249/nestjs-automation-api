import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { ProductFavoriteService } from './product-favorite.service';
import { ProductFavoriteDto, GetProductFavoriteDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { OptionalSessionGuard } from '../session/guard';

@ApiTags('ProductFavorite')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/productFavorites',
  version: ['1'],
})
export class FavoriteController {
  constructor(private service: ProductFavoriteService) {}

  @ApiOperation({ description: 'show favorite by given id' })
  @Get('/status/:productId')
  @HttpCode(HttpStatus.OK)
  async statusByProductId(
    @GetUser() user: User,
    @Param('productId') entityId: bigint,
  ) {
    return await this.service.statusByProductId(user, entityId);
  }

  // public url
  @ApiOperation({ description: 'show all my favorites' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductFavoriteDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetProductFavoriteDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'create favorite by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: ProductFavoriteDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'remove favorite by user' })
  @Delete('/product/:productId')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @GetUser() user: User,
    @Param('productId') entityId: bigint,
  ) {
    return await this.service.deleteByProductId(user, entityId);
  }
}

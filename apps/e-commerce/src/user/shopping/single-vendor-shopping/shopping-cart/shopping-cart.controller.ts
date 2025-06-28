import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SingleVendorShoppingCartService } from './shopping-cart.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { OptionalJwtGuard } from '@rahino/auth';
import { SessionGuard } from '../../../session/guard';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import {
  AddProductShoppingCartDto,
  GetShoppingCartDto,
  GetShoppingPriceDto,
  RemoveShoppingCartDto,
} from './dto';

@ApiTags('shoppingCarts')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/shoppingCarts',
  version: ['1'],
})
@Controller()
export class ShoppingCartController {
  constructor(private readonly service: SingleVendorShoppingCartService) {}

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'show all shoppingCarts' })
  @ApiQuery({
    name: 'filter',
    type: GetShoppingCartDto,
    style: 'deepObject',
    explode: true,
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter, @GetECSession() session: ECUserSession) {
    return await this.service.findAll(filter, session);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'get price of shoppingCart' })
  @Post('/price')
  @HttpCode(HttpStatus.OK)
  async getShoppingCartPrice(
    @Body() dto: GetShoppingPriceDto,
    @GetECSession() session: ECUserSession,
  ) {
    return await this.service.getShoppingPrice(dto, session);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'add product to shoppingCart' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async addProductShoppingCart(
    @Body() dto: AddProductShoppingCartDto,
    @GetECSession() session: ECUserSession,
  ) {
    return await this.service.addProduct(session, dto);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'remove shoppingCart product' })
  @Delete('/shoppingCartProduct/:id')
  @HttpCode(HttpStatus.OK)
  async removeShoppingCartProduct(
    @Param('id') shoppingCartProductId: bigint,
    @GetECSession() session: ECUserSession,
  ) {
    return await this.service.removeShoppingCartProduct(
      session,
      shoppingCartProductId,
    );
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'remove shoppingCart' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async removeShoppingCart(
    @Param('id') shoppingCartId: bigint,
    @GetECSession() session: ECUserSession,
  ) {
    return await this.service.removeShoppingCart(session, shoppingCartId);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { OptionalJwtGuard } from '@rahino/auth';
import { SessionGuard } from '../../session/guard';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetShoppingCartDto } from './dto';

@ApiTags('shoppingCarts')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/shoppingCarts',
  version: ['1'],
})
@Controller()
export class ShoppingCartController {
  constructor(private readonly service: ShoppingCartService) {}

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
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { OptionalJwtGuard } from '@rahino/auth';
import { SessionGuard } from '../../session/guard';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';

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
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetECSession() session: ECUserSession) {
    return await this.service.findAll(session);
  }
}

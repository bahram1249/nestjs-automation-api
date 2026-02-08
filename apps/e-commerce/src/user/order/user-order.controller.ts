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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { UserOrderService } from './user-order.service';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
  OrderStatusResponseDto,
  OrderShipmentWayResponseDto,
  OrderAddressResponseDto,
  OrderPaymentResponseDto,
  ProductResponseDto,
  VendorResponseDto,
  InventoryResponseDto,
  ColorResponseDto,
  GuaranteeResponseDto,
  GuaranteeMonthResponseDto,
  AttachmentResponseDto,
} from './dto';

@ApiTags('User-Orders')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/orders',
  version: ['1'],
})
export class UserOrderController {
  constructor(private readonly service: UserOrderService) {}

  // public url
  @ApiOperation({ description: 'show all orders' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: OrderResponseDto,
    isArray: true,
    extraModels: [
      OrderDetailResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      OrderAddressResponseDto,
      OrderPaymentResponseDto,
      ProductResponseDto,
      VendorResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      AttachmentResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show order by given id' })
  @Get('/:id')
  @ApiJsonResponse({
    type: OrderResponseDto,
    extraModels: [
      OrderDetailResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      OrderAddressResponseDto,
      OrderPaymentResponseDto,
      ProductResponseDto,
      VendorResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      AttachmentResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(entityId, user);
  }
}

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
import { ClientOrderService } from './client-order.service';
import {
  LogisticOrderResponseDto,
  OrderStatusResponseDto,
  PaymentResponseDto,
  UserResponseDto,
  AddressResponseDto,
  ProvinceResponseDto,
  CityResponseDto,
  NeighborhoodResponseDto,
  LogisticOrderGroupedResponseDto,
  LogisticOrderGroupedDetailResponseDto,
  LogisticResponseDto,
  LogisticShipmentWayResponseDto,
  OrderShipmentWayResponseDto,
  LogisticSendingPeriodResponseDto,
  ScheduleSendingTypeResponseDto,
  LogisticWeeklyPeriodResponseDto,
  LogisticWeeklyPeriodTimeResponseDto,
  ProductResponseDto,
  InventoryResponseDto,
  ColorResponseDto,
  GuaranteeResponseDto,
  GuaranteeMonthResponseDto,
  VendorResponseDto,
  DiscountResponseDto,
  AttachmentResponseDto,
} from './dto';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Logistic-User-Orders')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/basedLogistic/orders',
  version: ['1'],
})
export class ClientOrderController {
  constructor(private readonly service: ClientOrderService) {}

  // public url
  @ApiOperation({ description: 'show all orders' })
  @ApiJsonResponse({
    type: LogisticOrderResponseDto,
    isArray: true,
    extraModels: [
      OrderStatusResponseDto,
      PaymentResponseDto,
      UserResponseDto,
      AddressResponseDto,
      ProvinceResponseDto,
      CityResponseDto,
      NeighborhoodResponseDto,
      LogisticOrderGroupedResponseDto,
      LogisticOrderGroupedDetailResponseDto,
      LogisticResponseDto,
      LogisticShipmentWayResponseDto,
      OrderShipmentWayResponseDto,
      LogisticSendingPeriodResponseDto,
      ScheduleSendingTypeResponseDto,
      LogisticWeeklyPeriodResponseDto,
      LogisticWeeklyPeriodTimeResponseDto,
      ProductResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      VendorResponseDto,
      DiscountResponseDto,
      AttachmentResponseDto,
    ],
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show order by given id' })
  @ApiJsonResponse({
    type: LogisticOrderResponseDto,
    extraModels: [
      OrderStatusResponseDto,
      PaymentResponseDto,
      UserResponseDto,
      AddressResponseDto,
      ProvinceResponseDto,
      CityResponseDto,
      NeighborhoodResponseDto,
      LogisticOrderGroupedResponseDto,
      LogisticOrderGroupedDetailResponseDto,
      LogisticResponseDto,
      LogisticShipmentWayResponseDto,
      OrderShipmentWayResponseDto,
      LogisticSendingPeriodResponseDto,
      ScheduleSendingTypeResponseDto,
      LogisticWeeklyPeriodResponseDto,
      LogisticWeeklyPeriodTimeResponseDto,
      ProductResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      VendorResponseDto,
      DiscountResponseDto,
      AttachmentResponseDto,
    ],
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(entityId, user);
  }
}

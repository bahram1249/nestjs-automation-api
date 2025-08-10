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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AdminLogisticShipmentWayService } from './admin-logistic-shipmentway.service';
import { CreateLogisticShipmentWayDto, GetLogisticShipmentWayDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Admin Logistic Shipment Ways')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/logisticShipmentWays',
  version: ['1'],
})
export class AdminLogisticShipmentWayController {
  constructor(private service: AdminLogisticShipmentWayService) {}

  @ApiOperation({ description: 'show all logistic shipment ways' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.logisticshipmentways.getall',
  })
  @Get('/:logisticId')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticShipmentWayDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetLogisticShipmentWayDto,
    @Param('logisticId') logisticId: bigint,
    @GetUser() user: User,
  ) {
    return await this.service.findAll(user, logisticId, filter);
  }

  @ApiBody({ type: CreateLogisticShipmentWayDto })
  @ApiOperation({ description: 'create logistic user by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.logisticshipmentways.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: CreateLogisticShipmentWayDto,
  ) {
    return await this.service.create(user, dto);
  }
}

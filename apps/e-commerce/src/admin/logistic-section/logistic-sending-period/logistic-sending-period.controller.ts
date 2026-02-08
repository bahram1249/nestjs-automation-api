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
import { LogisticSendingPeriodService } from './logistic-sending-period.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import {
  LogisticSendingPeriodDto,
  GetLogisticSendingPeriodDto,
  LogisticSendingPeriodResponseDto,
  LogisticSendingPeriodDeleteResponseDto,
  ShipmentWayResponseDto,
  ScheduleSendingTypeResponseDto,
} from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Admin-LogisticSendingPeriod')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/logisticSendingPeriods',
})
export class LogisticSendingPeriodController {
  constructor(private readonly service: LogisticSendingPeriodService) {}

  // public url
  @ApiOperation({ description: 'show all logistic sending periods' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticSendingPeriodDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticsendingperiods.getall',
  })
  @ApiJsonResponse({
    type: LogisticSendingPeriodResponseDto,
    isArray: true,
    extraModels: [ShipmentWayResponseDto, ScheduleSendingTypeResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetLogisticSendingPeriodDto,
    @GetUser() user: User,
  ) {
    return await this.service.findAll(user, filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show discount by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticsendingperiods.getone',
  })
  @Get('/:id')
  @ApiJsonResponse({
    type: LogisticSendingPeriodResponseDto,
    extraModels: [ShipmentWayResponseDto, ScheduleSendingTypeResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create logistic sending period by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticsendingperiods.create',
  })
  @Post('/')
  @ApiJsonResponse({
    type: LogisticSendingPeriodResponseDto,
    status: 201,
    extraModels: [ShipmentWayResponseDto, ScheduleSendingTypeResponseDto],
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: LogisticSendingPeriodDto) {
    return await this.service.create(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update logistic sending period by admin' })
  @Put('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticsendingperiods.update',
  })
  @ApiJsonResponse({
    type: LogisticSendingPeriodResponseDto,
    extraModels: [ShipmentWayResponseDto, ScheduleSendingTypeResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') entityId: bigint,
    @Body() dto: LogisticSendingPeriodDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(entityId, dto, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete logistic sending period by admin' })
  @Delete('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticsendingperiods.delete',
  })
  @ApiJsonResponse({ type: LogisticSendingPeriodDeleteResponseDto })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
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
import { InventoryStatusService } from './inventory-status.service';
import { ApiJsonResponse } from '@rahino/response';
import { InventoryStatusResponseDto } from './dto';

@ApiTags('anonymousInventoryStatuses')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/anonymous/inventoryStatuses',
  version: ['1'],
})
export class InventoryStatusController {
  constructor(private readonly service: InventoryStatusService) {}

  // public url

  @ApiOperation({ description: 'show all inventory statuses' })
  @ApiJsonResponse({ type: InventoryStatusResponseDto, isArray: true })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show inventory status by given id' })
  @ApiJsonResponse({ type: InventoryStatusResponseDto, isArray: true })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

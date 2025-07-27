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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { LogisticService } from './admin-logistic.service';
import { LogisticDto, GetLogisticDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('AdminLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/logistics',
  version: ['1'],
})
export class AdminLogisticController {
  constructor(private service: LogisticService) {}

  @ApiOperation({ description: 'show all logistics' })
  @CheckPermission({ permissionSymbol: 'ecommerce.logistics.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetLogisticDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show logistic by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.logistics.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create logistic by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.logistics.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: LogisticDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'update logistics by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.logistics.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: bigint, @Body() dto: LogisticDto) {
    return await this.service.update(entityId, dto);
  }

  @ApiOperation({ description: 'delete vendor by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.logistics.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

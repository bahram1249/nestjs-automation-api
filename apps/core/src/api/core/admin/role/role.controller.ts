import {
  Body,
  Controller,
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
import { JwtGuard } from '../../auth/guard';
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor/json-response-transform.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { RoleDto } from './dto';
import { RoleService } from './role.service';

@ApiTags('Admin-Role')
@ApiBearerAuth('Authorization')
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/admin/roles')
@UseInterceptors(JsonResponseTransformInterceptor)
export class RoleController {
  constructor(private service: RoleService) {}
  @ApiOperation({ description: 'show all roles' })
  @CheckPermission({ url: '/api/core/admin/roles', method: 'get' })
  @Get('/')
  @ApiQuery({
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show role by given id' })
  @CheckPermission({ url: '/api/core/admin/roles/:id', method: 'get' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') roleId: number) {
    return {
      result: await this.service.findById(roleId),
    };
  }
  @ApiOperation({ description: 'create role by admin' })
  @CheckPermission({ url: '/api/core/admin/roles', method: 'post' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: RoleDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update role by admin' })
  @Put('/:id')
  @CheckPermission({ url: '/api/core/admin/roles/:id', method: 'put' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') roleId: number, @Body() dto: RoleDto) {
    return await this.service.update(roleId, dto);
  }
}

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
import { JwtGuard } from '../../../../util/core/auth/guard';
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor/json-response-transform.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleDto } from './dto';
import { RoleService } from './role.service';
import { RoleGetDto } from './dto/role-get.dto';

@ApiTags('Admin-Role')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/admin/roles')
@UseInterceptors(JsonResponseTransformInterceptor)
export class RoleController {
  constructor(private service: RoleService) {}
  @ApiOperation({ description: 'show all roles' })
  @CheckPermission({ permissionSymbol: 'core.admin.roles.getall' })
  @Get('/')
  @ApiQuery({
    type: RoleGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: RoleGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show role by given id' })
  @CheckPermission({ permissionSymbol: 'core.admin.roles.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') roleId: number) {
    return await this.service.findById(roleId);
  }
  @ApiOperation({ description: 'create role by admin' })
  @CheckPermission({ permissionSymbol: 'core.admin.roles.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: RoleDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update role by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'core.admin.roles.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') roleId: number, @Body() dto: RoleDto) {
    return await this.service.update(roleId, dto);
  }
}

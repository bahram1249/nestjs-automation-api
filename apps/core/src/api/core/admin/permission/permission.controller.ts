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
import { PermissionService } from './permission.service';
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
import { PermissionGetDto } from './dto/PermissionGet.dto';

@ApiTags('Admin-Permissions')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/admin/permissions')
@UseInterceptors(JsonResponseTransformInterceptor)
export class PermissionController {
  constructor(private service: PermissionService) {}
  @ApiOperation({ description: 'show all permissions' })
  @ApiQuery({
    type: PermissionGetDto,
  })
  @CheckPermission({ permissionSymbol: 'core.admin.permissions.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PermissionGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show permission by given id' })
  @CheckPermission({ permissionSymbol: 'core.admin.permissions.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') permissionId: number) {
    await this.service.findById(permissionId);
  }
}

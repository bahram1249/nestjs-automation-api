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
import { PermissionGroupService } from './permission-group.service';
import { JwtGuard } from '../../../../util/core/auth/guard';
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGroupGetDto } from './dto';

@ApiTags('Admin-PermissionGroups')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/admin/permissionGroups')
@UseInterceptors(JsonResponseTransformInterceptor)
export class PermissionGroupController {
  constructor(private service: PermissionGroupService) {}
  @ApiOperation({ description: 'show all permission groups' })
  @ApiQuery({
    type: PermissionGroupGetDto,
  })
  @CheckPermission({ permissionSymbol: 'core.admin.permissiongroups.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PermissionGroupGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show group permission by given id' })
  @CheckPermission({ permissionSymbol: 'core.admin.permissiongroups.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') permissionId: number) {
    await this.service.findById(permissionId);
  }
}

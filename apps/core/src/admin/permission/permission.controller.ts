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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGetDto } from './dto';
import { JwtGuard } from '@rahino/auth';

@ApiTags('Admin-Permissions')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/core/admin/permissions',
  version: ['1'],
})
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
    return await this.service.findById(permissionId);
  }
}

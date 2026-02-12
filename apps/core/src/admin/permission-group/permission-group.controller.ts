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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PermissionGroupGetDto,
  PermissionGroupResponseDto,
  PermissionGroupPermissionResponseDto,
} from './dto';
import { JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Admin-PermissionGroups')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/core/admin/permissionGroups',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PermissionGroupController {
  constructor(private service: PermissionGroupService) {}
  @ApiOperation({ description: 'show all permission groups' })
  @ApiJsonResponse({
    type: PermissionGroupResponseDto,
    isArray: true,
    extraModels: [PermissionGroupPermissionResponseDto],
  })
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
  @ApiJsonResponse({
    type: PermissionGroupResponseDto,
    extraModels: [PermissionGroupPermissionResponseDto],
  })
  @CheckPermission({ permissionSymbol: 'core.admin.permissiongroups.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') permissionId: number) {
    return await this.service.findById(permissionId);
  }
}

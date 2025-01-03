import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { User } from '@rahino/database';
import { JwtGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';

@ApiTags('User-Permissions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: '/api/core/user/permissions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PermissionController {
  constructor(private service: PermissionService) {}

  @ApiOperation({ description: 'isAccess to this permissions' })
  @Get('/isAccess/:permissionSymbol')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @GetUser() user: User,
    @Param('permissionSymbol') permissionSymbol: string,
  ) {
    return await this.service.isAccess(user, permissionSymbol);
  }
}

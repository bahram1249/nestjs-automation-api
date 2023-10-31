import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { RoleService } from './role.service';
import { GetUser } from '../../../../util/core/auth/decorator';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { RoleGetDto } from './dto';

@ApiTags('User-Roles')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/user/roles')
@UseInterceptors(JsonResponseTransformInterceptor)
export class RoleController {
  constructor(private service: RoleService) {}
  @ApiOperation({ description: 'show all roles of current user' })
  //@CheckPermission({ permissionSymbol: 'core.user.roles.getall' })
  @Get('/')
  @ApiQuery({
    type: RoleGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: RoleGetDto) {
    return await this.service.findAll(user.id, filter);
  }
}

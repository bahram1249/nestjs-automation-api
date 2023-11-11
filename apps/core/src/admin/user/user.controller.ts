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
import { UserService } from './user.service';
import { JwtGuard } from '../../util/core/auth/guard';
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { UserDto } from './dto';

@ApiTags('Admin-Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/core/admin/users',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class UserController {
  constructor(private service: UserService) {}
  @ApiOperation({ description: 'show all users' })
  @ApiQuery({
    type: ListFilter,
  })
  @CheckPermission({ permissionSymbol: 'core.admin.users.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show user by given id' })
  @CheckPermission({ permissionSymbol: 'core.admin.users.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') userId: bigint) {
    await this.service.findById(userId);
  }
  @ApiOperation({ description: 'create user by admin' })
  @CheckPermission({ permissionSymbol: 'core.admin.users.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: UserDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update user by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'core.admin.users.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') userId: bigint, @Body() dto: UserDto) {
    return await this.service.update(userId, dto);
  }
}

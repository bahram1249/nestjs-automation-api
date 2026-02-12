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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter/types';
import { UserDto, UserResponseDto, UserRoleResponseDto } from './dto';
import { JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';

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
  @ApiJsonResponse({
    type: UserResponseDto,
    isArray: true,
    extraModels: [UserRoleResponseDto],
  })
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
  @ApiJsonResponse({
    type: UserResponseDto,
    extraModels: [UserRoleResponseDto],
  })
  @CheckPermission({ permissionSymbol: 'core.admin.users.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') userId: bigint) {
    return await this.service.findById(userId);
  }
  @ApiOperation({ description: 'create user by admin' })
  @ApiJsonResponse({
    type: UserResponseDto,
    status: 201,
    extraModels: [UserRoleResponseDto],
  })
  @CheckPermission({ permissionSymbol: 'core.admin.users.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: UserDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update user by admin' })
  @ApiJsonResponse({
    type: UserResponseDto,
    extraModels: [UserRoleResponseDto],
  })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'core.admin.users.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') userId: bigint, @Body() dto: UserDto) {
    return await this.service.update(userId, dto);
  }
}

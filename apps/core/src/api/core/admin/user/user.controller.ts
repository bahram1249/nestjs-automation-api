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
import { JwtGuard } from '../../auth/guard';
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor/json-response-transform.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListFilter } from 'apps/core/src/util/core/query';
import { UserDto } from './dto';

@ApiTags('Admin-Users')
@ApiBearerAuth('Authorization')
@UseGuards(JwtGuard, PermissionGuard)
@Controller('/api/core/admin/users')
@UseInterceptors(JsonResponseTransformInterceptor)
export class UserController {
  constructor(private service: UserService) {}
  @ApiOperation({ description: 'show all users' })
  @CheckPermission({ url: '/api/core/admin/users', method: 'get' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show user by given id' })
  @CheckPermission({ url: '/api/core/admin/users/:id', method: 'get' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') userId: bigint) {
    return {
      result: await this.service.findById(userId),
    };
  }
  @ApiOperation({ description: 'create user by admin' })
  @CheckPermission({ url: '/api/core/admin/users', method: 'post' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userDto: UserDto) {
    return await this.service.create(userDto);
  }

  @ApiOperation({ description: 'update user by admin' })
  @Put('/:id')
  @CheckPermission({ url: '/api/core/admin/users/:id', method: 'put' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') userId: bigint, @Body() userDto: UserDto) {
    return await this.service.update(userId, userDto);
  }
}

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
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { User } from '@rahino/database';
import { RoleGetDto } from './dto';
import { JwtGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';

@ApiTags('User-Roles')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/core/user/roles',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RoleController {
  constructor(private service: RoleService) {}
  @ApiOperation({ description: 'show all roles of current user' })
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

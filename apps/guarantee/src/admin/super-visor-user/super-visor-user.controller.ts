import {
  Body,
  Controller,
  Delete,
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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { GetSuperVisorDto, SuperVisorUserDto } from './dto';
import { SuperVisorUserService } from './super-visor-user.service';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-SuperVisorUsers')
@Controller({
  path: '/api/guarantee/admin/superVisorUsers',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SuperVisorController {
  constructor(private service: SuperVisorUserService) {}

  @ApiOperation({ description: 'show all supervisor person' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supervisorusers.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSuperVisorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetSuperVisorDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show super visor user by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supervisorusers.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create super visor user' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supervisorusers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: SuperVisorUserDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'update super visor user by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supervisorusers.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: SuperVisorUserDto,
  ) {
    return await this.service.updateById(user, id, dto);
  }

  @ApiOperation({ description: 'delete super visor user by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supervisorusers.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.deleteById(user, entityId);
  }
}

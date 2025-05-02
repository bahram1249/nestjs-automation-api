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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { EntityTypeFactorService } from './entity-type-factor.service';
import { EntityTypeFactorDto, GetEntityTypeFactorDto } from './dto';

@ApiTags('Admin-EntityType-Factors')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/entityTypeFactors',
})
export class EntityTypeFactorController {
  constructor(private readonly service: EntityTypeFactorService) {}

  // public url
  @ApiOperation({ description: 'show all entityType factors' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetEntityTypeFactorDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.entitytypefactors.getall',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetEntityTypeFactorDto,
    @GetUser() user: User,
  ) {
    return await this.service.findAll(user, filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show entity type factor by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.entitytypefactors.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create entity type factors by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.entitytypefactors.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: EntityTypeFactorDto) {
    return await this.service.create(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update entity type factor by admin' })
  @Put('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.entitytypefactors.update',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') entityId: number,
    @Body() dto: EntityTypeFactorDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(entityId, dto, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete entity type factor by admin' })
  @Delete('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.entitytypefactors.delete',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

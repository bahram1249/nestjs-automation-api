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
import { JwtGuard } from '@rahino/auth';
import { LinkedEntityTypeBrandService } from './linked-entity-type-brand.service';
import { LinkedEntityTypeBrandDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('Admin-LinkedEntityTypeBrands')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/linkedEntityTypeBrands',
  version: ['1'],
})
export class LinkedEntityTypeBrandController {
  constructor(private service: LinkedEntityTypeBrandService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.linkedentitytypebrands.getall',
  })
  @ApiOperation({ description: 'show all linked entity type brands' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show linked entity type brand by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.linkedentitytypebrands.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create linked entity type brand by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.linkedentitytypebrands.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: LinkedEntityTypeBrandDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update linked entity type by admin' })
  @Put('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.linkedentitytypebrands.update',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') entityId: number,
    @Body() dto: LinkedEntityTypeBrandDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(entityId, dto, user);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete linked entity type brands by admin' })
  @Delete('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.linkedentitytypebrands.delete',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

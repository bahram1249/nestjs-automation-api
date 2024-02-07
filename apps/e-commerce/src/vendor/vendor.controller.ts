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

import { JwtGuard } from '@rahino/auth/guard';
import { VendorService } from './vendor.service';
import { VendorDto, GetVendorDto } from './dto';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';

@ApiTags('Vendors')
@Controller({
  path: '/api/ecommerce/vendors',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VendorController {
  constructor(private service: VendorService) {}

  // public url
  @ApiOperation({ description: 'show all vendors' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVendorDto) {
    return await this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show vendor by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create color by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: VendorDto) {
    return await this.service.create(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update vendor by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: VendorDto) {
    return await this.service.update(entityId, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete vendor by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

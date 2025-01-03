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
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { VendorAddressService } from './vendor-address.service';
import {
  GetVendorAddressDto,
  VendorAddressDto,
} from '@rahino/ecommerce/vendor-address/dto';

@ApiTags('VendorAddresses')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/vendorAddresses',
  version: ['1'],
})
export class VendorAddressController {
  constructor(private readonly service: VendorAddressService) {}

  @ApiOperation({ description: 'show all vendors' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendoraddresses.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorAddressDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetVendorAddressDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show vendor by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendoraddresses.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create color by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendoraddresses.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: VendorAddressDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'update vendor by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendoraddresses.update' })
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: VendorAddressDto,
  ) {
    return await this.service.update(user, entityId, dto);
  }

  @ApiOperation({ description: 'delete vendor by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendoraddresses.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.deleteById(user, entityId);
  }
}

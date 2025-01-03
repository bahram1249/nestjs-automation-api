import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AdminAddressService } from './address.service';
import { AddressDto, GetAddressDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';

@ApiTags('Admin-Addresses')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/addresses',
  version: ['1'],
})
export class AdminAddressController {
  constructor(private service: AdminAddressService) {}

  // public url
  @ApiOperation({ description: 'show all addresses' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.addresses.getall' })
  @Get('/user/:id')
  @ApiQuery({
    name: 'filter',
    type: GetAddressDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('id') userId: bigint,
    @GetUser() user: User,
    @Query() filter: GetAddressDto,
  ) {
    return await this.service.findAll(userId, user, filter);
  }

  @ApiOperation({ description: 'show address by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.addresses.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'update address by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.addresses.update' })
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: AddressDto,
  ) {
    return await this.service.update(user, entityId, dto);
  }
}

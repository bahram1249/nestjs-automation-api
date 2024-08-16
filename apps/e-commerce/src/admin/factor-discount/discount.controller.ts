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
import { DiscountService } from './discount.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth/guard';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { CreateDiscountDto, FactorDiscountDto, GetDiscountDto } from './dto';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';

@ApiTags('Admin-FactorDiscounts')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/factorDiscounts',
})
export class DiscountController {
  constructor(private readonly service: DiscountService) {}

  // public url
  @ApiOperation({ description: 'show all factor discounts' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.factordiscounts.getall',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetDiscountDto, @GetUser() user: User) {
    return await this.service.findAll(user, filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show factor discount by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.factordiscounts.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create factor discount by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.factordiscounts.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: CreateDiscountDto) {
    return await this.service.create(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update factor discount by admin' })
  @Put('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.factordiscounts.update',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') entityId: bigint,
    @Body() dto: FactorDiscountDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(entityId, dto, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete factor discounts by admin' })
  @Delete('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.factordiscounts.delete',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

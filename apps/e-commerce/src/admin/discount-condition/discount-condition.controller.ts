import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiscountConditionService } from './discount-condition.service';
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
import { DiscountConditionDto, GetDiscountConditionDto } from './dto';

@ApiTags('Admin-DiscountConditions')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/discountConditions',
  version: ['1'],
})
export class DiscountConditionController {
  constructor(private readonly service: DiscountConditionService) {}

  @ApiOperation({ description: 'show all discounts' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountConditionDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.discountconditions.getall',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetDiscountConditionDto,
  ) {
    return await this.service.findAll(user, filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show discount by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.discountconditions.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create discount by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.discountconditions.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: DiscountConditionDto) {
    return await this.service.create(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete discount by admin' })
  @Delete('/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.discountconditions.delete',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.deleteById(user, entityId);
  }
}

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
  Version,
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
import { CourierService } from './courier.service';
import { CourierDto, CourierV2Dto, GetCourierDto } from './dto';
import { UserCourierV2Dto } from './dto/user-courier-v2-dto';

@ApiTags('Admin-Couriers')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/couriers',
})
export class CourierController {
  constructor(private readonly service: CourierService) {}

  // public url
  @ApiOperation({ description: 'show all couriers' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.getall' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetCourierDto, @GetUser() user: User) {
    return await this.service.findAll(user, filter);
  }

  @Version('2')
  @ApiOperation({ description: 'show all couriers' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.getall' })
  @HttpCode(HttpStatus.OK)
  async findAllV2(@Query() filter: GetCourierDto, @GetUser() user: User) {
    return await this.service.findAllV2(user, filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show courier by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show courier by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdV2(@Param('id') entityId: number, @GetUser() user: User) {
    return await this.service.findByIdV2(entityId, user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create courier by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: CourierDto) {
    return await this.service.create(user, dto);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create courier by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createV2(@GetUser() user: User, @Body() dto: CourierV2Dto) {
    return await this.service.createV2(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete courier by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.couriers.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

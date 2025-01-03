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
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('Admin-Notifications')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/notifications',
  version: ['1'],
})
export class NotificationController {
  constructor(private service: NotificationService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.notifications.getall' })
  @ApiOperation({ description: 'show all notifications' })
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
  @ApiOperation({ description: 'show notification by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.notifications.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create notification by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.notifications.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: NotificationDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update notifications by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.notifications.update' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') entityId: bigint,
    @Body() dto: NotificationDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(entityId, dto, user);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete notification by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.notifications.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

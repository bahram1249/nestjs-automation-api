import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { HeaderNotificationService } from './notification.service';
import { HeaderNotificationDto, HeaderNotificationResponseDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Admin-HeaderNotifications')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/headerNotifications',
  version: ['1'],
})
export class HeaderNotificationController {
  constructor(private service: HeaderNotificationService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.headernotifications.getall',
  })
  @ApiOperation({ description: 'get header notification' })
  @ApiJsonResponse({ type: HeaderNotificationResponseDto })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findOne() {
    return await this.service.findOne();
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update notification by admin' })
  @ApiJsonResponse({ type: Object })
  @Put('/')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.headernotifications.update',
  })
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: HeaderNotificationDto, @GetUser() user: User) {
    return await this.service.update(dto, user);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeaderNotificationService } from './notification.service';

@ApiTags('Admin-HeaderNotifications')
@Controller({
  path: '/api/ecommerce/user/headerNotifications',
  version: ['1'],
})
export class HeaderNotificationController {
  constructor(private service: HeaderNotificationService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'get header notification' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findOne() {
    return await this.service.findOne();
  }
}

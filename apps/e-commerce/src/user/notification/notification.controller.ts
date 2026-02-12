import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { NotificationService } from './notification.service';
import { ListFilter } from '@rahino/query-filter';
import { ApiJsonResponse } from '@rahino/response';
import { NotificationResponseDto } from './dto';

@ApiTags('User-Notifications')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/user/notifications',
  version: ['1'],
})
export class NotificationController {
  constructor(private service: NotificationService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all notifications' })
  @ApiJsonResponse({ type: NotificationResponseDto, isArray: true })
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
  @ApiJsonResponse({ type: NotificationResponseDto })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }
}

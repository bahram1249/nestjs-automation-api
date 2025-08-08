import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { ScheduleSendingTypeService } from './schedule-sending-type.service';
import { GetScheduleSendingTypeDto } from './dto';

@ApiTags('Admin Schedule Sending Type')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/scheduleSendingTypes',
  version: ['1'],
})
export class ScheduleSendingTypeController {
  constructor(private service: ScheduleSendingTypeService) {}

  @ApiOperation({ description: 'show all schedule sending types' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetScheduleSendingTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetScheduleSendingTypeDto) {
    return await this.service.findAll(filter);
  }
}

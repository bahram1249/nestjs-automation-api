import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ActivityTypeApiService } from './activity-type.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('BPMN - Activity Types')
@Controller({ path: '/api/bpmn/activity-types', version: ['1'] })
export class ActivityTypeApiController {
  constructor(private readonly service: ActivityTypeApiService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List activity types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup activity types' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: ListFilter) {
    return this.service.lookup(filter);
  }
}

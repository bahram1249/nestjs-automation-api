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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ActionTypeService } from './action-type.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('BPMN - Action Types')
@Controller({ path: '/api/bpmn/action-types', version: ['1'] })
export class ActionTypeController {
  constructor(private readonly service: ActionTypeService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List action types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup action types' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: ListFilter) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get action type by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }
}

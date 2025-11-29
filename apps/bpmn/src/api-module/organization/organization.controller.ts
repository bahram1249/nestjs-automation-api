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
import { OrganizationApiService } from './organization.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('BPMN - Organizations')
@Controller({ path: '/api/bpmn/organizations', version: ['1'] })
export class OrganizationApiController {
  constructor(private readonly service: OrganizationApiService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List organizations' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup organizations' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: ListFilter) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get organization by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    const { result } = await this.service.lookup({
      limit: 1,
      offset: 0,
    } as any);
    return { result: result.find((x: any) => x.id === Number(id)) };
  }
}

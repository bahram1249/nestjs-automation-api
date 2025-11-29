import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ReferralTypeService } from './referral-type.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('BPMN - Referral Types')
@Controller({ path: '/api/bpmn/referral-types', version: ['1'] })
export class ReferralTypeController {
  constructor(private readonly service: ReferralTypeService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List referral types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup referral types' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: ListFilter) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get referral type by id' })
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

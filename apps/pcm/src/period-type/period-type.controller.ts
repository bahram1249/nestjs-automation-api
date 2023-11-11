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
import { CheckPermission } from 'apps/core/src/util/core/permission/decorator';
import { PermissionGuard } from 'apps/core/src/util/core/permission/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from 'apps/core/src/util/core/auth/guard';
import { PeriodTypeService } from './period-type.service';
import { PeriodTypeGetDto } from './dto';

@ApiTags('PCM-PeriodTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/pcm/periodTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PeriodTypeController {
  constructor(private service: PeriodTypeService) {}
  @ApiOperation({ description: 'show all period types' })
  @CheckPermission({ permissionSymbol: 'pcm.periodtypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PeriodTypeGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PeriodTypeGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show period type by given id' })
  @CheckPermission({ permissionSymbol: 'pcm.periodtypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

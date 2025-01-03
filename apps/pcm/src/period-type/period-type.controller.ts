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

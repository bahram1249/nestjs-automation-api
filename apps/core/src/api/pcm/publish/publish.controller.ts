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
import { PublishGetDto } from './dto';
import { PublishService } from './publish.service';

@ApiTags('PCM-Publishes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/pcm/publishes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PublishController {
  constructor(private service: PublishService) {}
  @ApiOperation({ description: 'show all publishes' })
  @CheckPermission({ permissionSymbol: 'pcm.publishes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PublishGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PublishGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show publish by given id' })
  @CheckPermission({ permissionSymbol: 'pcm.publishes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

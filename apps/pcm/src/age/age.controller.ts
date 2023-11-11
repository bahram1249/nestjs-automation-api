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
import { AgeGetDto } from './dto';
import { AgeService } from './age.service';

@ApiTags('PCM-Ages')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/pcm/ages',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AgeController {
  constructor(private service: AgeService) {}
  @ApiOperation({ description: 'show all ages' })
  @CheckPermission({ permissionSymbol: 'pcm.ages.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: AgeGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: AgeGetDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show age by given id' })
  @CheckPermission({ permissionSymbol: 'pcm.ages.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

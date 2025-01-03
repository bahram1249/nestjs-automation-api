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

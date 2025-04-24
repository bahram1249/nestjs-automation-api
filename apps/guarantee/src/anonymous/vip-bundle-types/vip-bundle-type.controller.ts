import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VipBundleTypeService } from './vip-bundle-type.service';
import { GetVipBundleTypeDto } from './dto';

@ApiTags('GS-Anonymous-VIPBundleType')
@Controller({
  path: '/api/guarantee/anonymous/vipBundleTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VipBundleTypeController {
  constructor(private service: VipBundleTypeService) {}

  @ApiOperation({ description: 'show all vip bundle types without auth' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVipBundleTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVipBundleTypeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({
    description: 'show vip bundle types by given id without auth',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

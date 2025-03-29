import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { VipBundleTypeService } from './vip-bundle-type.service';
import { GetVipBundleTypeDto, VipBundleTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-VIPBundleType')
@Controller({
  path: '/api/guarantee/admin/vipBundleTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VipBundleTypeController {
  constructor(private service: VipBundleTypeService) {}

  @ApiOperation({ description: 'show all vip bundle types' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipbundletypes.getall' })
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

  @ApiOperation({ description: 'show vip bundle types by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipbundletypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create vip bundle types' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipbundletypes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: VipBundleTypeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update vip bundle types by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipbundletypes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: VipBundleTypeDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete vip bundle types by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipbundletypes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

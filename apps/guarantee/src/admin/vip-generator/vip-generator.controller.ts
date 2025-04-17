import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { GetUser, JwtGuard } from '@rahino/auth';
import { VipGeneratorService } from './vip-generator.service';
import { GetVipGeneratorDto, VipGeneratorDto } from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-VipGenerators')
@Controller({
  path: '/api/guarantee/admin/vipGenerators',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VipGeneratorController {
  constructor(private service: VipGeneratorService) {}

  @ApiOperation({ description: 'show all vip generators' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVipGeneratorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVipGeneratorDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show vip generator by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create vip generators' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: VipGeneratorDto) {
    return await this.service.create(user, dto);
  }
}

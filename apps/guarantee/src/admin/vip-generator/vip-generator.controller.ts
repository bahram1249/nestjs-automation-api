import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
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
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-VipGenerators')
@Controller({
  path: '/api/guarantee/admin/vipGenerators',
  version: ['1'],
})
export class VipGeneratorController {
  constructor(private service: VipGeneratorService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
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

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show vip generator by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create vip generators' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: VipGeneratorDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'download excel file using id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.vipgenerators.getone' })
  @Get('/excel/:id')
  @HttpCode(HttpStatus.OK)
  async downloadExcel(@Param('id') entityId: number, @Res() res: Response) {
    return await this.service.downloadExcel(entityId, res);
  }
}

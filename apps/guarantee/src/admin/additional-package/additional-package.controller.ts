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
import { AdditionalPackageService } from './additional-package.service';
import { GetAdditionalPackageDto, AdditionalPackageDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-AdditionalPackages')
@Controller({
  path: '/api/guarantee/admin/additionalPackages',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AdditionalPackageController {
  constructor(private service: AdditionalPackageService) {}

  @ApiOperation({ description: 'show all additional package' })
  @CheckPermission({ permissionSymbol: 'gs.admin.additionalpackages.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAdditionalPackageDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAdditionalPackageDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show additional package by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.additionalpackages.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create additional package' })
  @CheckPermission({ permissionSymbol: 'gs.admin.additionalpackages.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: AdditionalPackageDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update additional package by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.additionalpackages.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: AdditionalPackageDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete additional package by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.additionalpackages.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

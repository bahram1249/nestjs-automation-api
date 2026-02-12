import {
  Body,
  Controller,
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
import { GetMenuDto, MenuDto, MenuResponseDto, SubMenuDto } from './dto';
import { MenuService } from './menu.service';
import { JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Admin-Menu')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/core/admin/menus',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class MenuController {
  constructor(private service: MenuService) {}

  @ApiOperation({ description: 'show all menus' })
  @ApiJsonResponse({
    type: MenuResponseDto,
    isArray: true,
    extraModels: [SubMenuDto],
  })
  @CheckPermission({ permissionSymbol: 'core.admin.menus.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetMenuDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetMenuDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show menu by given id' })
  @ApiJsonResponse({ type: MenuResponseDto, extraModels: [SubMenuDto] })
  @CheckPermission({ permissionSymbol: 'core.admin.menus.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') menuId: number) {
    return await this.service.findById(menuId);
  }

  @ApiOperation({ description: 'create menu by admin' })
  @ApiJsonResponse({
    type: MenuResponseDto,
    status: 201,
    extraModels: [SubMenuDto],
  })
  @CheckPermission({ permissionSymbol: 'core.admin.menus.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: MenuDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update menu by admin' })
  @ApiJsonResponse({ type: MenuResponseDto, extraModels: [SubMenuDto] })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'core.admin.menus.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') menuId: number, @Body() dto: MenuDto) {
    return await this.service.update(menuId, dto);
  }
}

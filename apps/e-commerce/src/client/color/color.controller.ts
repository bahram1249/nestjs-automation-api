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

import { JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { ColorService } from './color.service';
import { ColorDto, GetColorDto, ColorResponseDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { OptionalSessionGuard } from '../../user/session/guard';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';

@ApiTags('Colors')
@Controller({
  path: '/api/ecommerce/colors',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ColorController {
  constructor(private service: ColorService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all colors' })
  @ApiJsonResponse({ type: ColorResponseDto, isArray: true })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetColorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetColorDto,
    @GetECSession() session?: ECUserSession,
  ) {
    return await this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show color by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.colors.getone' })
  @ApiJsonResponse({ type: ColorResponseDto })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create color by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.colors.create' })
  @ApiJsonResponse({ type: ColorResponseDto, status: 201 })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ColorDto) {
    return await this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update color by admin' })
  @ApiJsonResponse({ type: ColorResponseDto })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.colors.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: ColorDto) {
    return await this.service.update(entityId, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete color by admin' })
  @ApiJsonResponse({ type: ColorResponseDto })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.colors.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

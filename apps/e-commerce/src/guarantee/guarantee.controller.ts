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

import { JwtGuard } from '@rahino/auth/guard';
import { GuaranteeService } from './guarantee.service';
import { GuaranteeDto, GetGuaranteeDto } from './dto';

@ApiTags('Guarantees')
@Controller({
  path: '/api/ecommerce/guarantees',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GuaranteeController {
  constructor(private service: GuaranteeService) {}

  // public url
  @ApiOperation({ description: 'show all guarantees' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetGuaranteeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetGuaranteeDto) {
    return await this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show guarantee by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.guarantees.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create guarantee by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.guarantees.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: GuaranteeDto) {
    return await this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update guarantee by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.guarantees.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: GuaranteeDto) {
    return await this.service.update(entityId, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete guarantee by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.guarantees.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

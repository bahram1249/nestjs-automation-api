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
import { FaqService } from './faq.service';
import { GetFaqDto, FaqDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Faqs')
@Controller({
  path: '/api/guarantee/admin/faqs',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class FaqController {
  constructor(private service: FaqService) {}

  @ApiOperation({ description: 'show all faqs' })
  @CheckPermission({ permissionSymbol: 'gs.admin.faqs.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetFaqDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetFaqDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show faq by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.faqs.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create faq' })
  @CheckPermission({ permissionSymbol: 'gs.admin.faqs.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: FaqDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update faq by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.faqs.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: FaqDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete faq by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.faqs.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}

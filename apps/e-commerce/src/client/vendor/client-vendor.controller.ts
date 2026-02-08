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
import { ClientVendorService } from './client-vendor.service';
import { GetVendorDto, VendorResponseDto, AttachmentResponseDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';

@UseInterceptors(JsonResponseTransformInterceptor)
@ApiTags('Client-Vendors')
@Controller({
  path: '/api/ecommerce/client/vendors',
  version: ['1'],
})
export class ClientVendorController {
  constructor(private service: ClientVendorService) {}

  @ApiOperation({ description: 'show all vendors in client' })
  @ApiJsonResponse({
    type: VendorResponseDto,
    isArray: true,
    extraModels: [AttachmentResponseDto],
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVendorDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show vendor by given id' })
  @ApiJsonResponse({
    type: VendorResponseDto,
    extraModels: [AttachmentResponseDto],
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'show vendor by given slug' })
  @ApiJsonResponse({
    type: VendorResponseDto,
    extraModels: [AttachmentResponseDto],
  })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { CourierPriceDto } from './dto';
import { CourierPriceService } from './courier-price.service';

@ApiTags('Admin-CourierPrices')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/courierPrices',
})
export class CourierPriceController {
  constructor(private readonly service: CourierPriceService) {}

  // public url
  @ApiOperation({ description: 'show all courier prices' })
  @Get('/price')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierprices.getone' })
  @HttpCode(HttpStatus.OK)
  async findOne() {
    return await this.service.findOne();
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create courier price by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierprices.update' })
  @Put('/price')
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CourierPriceDto) {
    return await this.service.update(dto);
  }
}

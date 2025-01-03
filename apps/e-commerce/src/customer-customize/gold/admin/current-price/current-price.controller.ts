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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { CurrentPriceService } from './current-price.service';
import { CurrentPriceDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Admin-CurrentPrices')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/currentPrices',
  version: ['1'],
})
export class CurrentPriceController {
  constructor(private service: CurrentPriceService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.currentprices.getall',
  })
  @ApiOperation({ description: 'get header notification' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findOne() {
    return await this.service.findOne();
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update notification by admin' })
  @Put('/')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.currentprices.update',
  })
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: CurrentPriceDto, @GetUser() user: User) {
    return await this.service.update(dto, user);
  }
}

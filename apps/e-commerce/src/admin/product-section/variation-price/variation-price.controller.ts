import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { VariationPriceService } from './variation-price.service';
import { ApiJsonResponse } from '@rahino/response';
import { VariationPriceResponseDto } from './dto';

@ApiTags('variation prices')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/variationPrices',
  version: ['1'],
})
export class VariationPriceController {
  constructor(private readonly service: VariationPriceService) {}

  // public url
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.variationprices.getall',
  })
  @ApiOperation({ description: 'show all variationprices' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: VariationPriceResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.variationprices.getone',
  })
  @ApiOperation({ description: 'show variation price by given id' })
  @Get('/:id')
  @ApiJsonResponse({
    type: VariationPriceResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { BasedProductSaleService } from './product-sale.service';
import { GetProductSaleDto, BasedProductSaleResponseDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Report-ProductSales-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/productSales',
  version: ['1'],
})
export class BasedProductSaleController {
  constructor(private service: BasedProductSaleService) {}

  @ApiOperation({ description: 'show all product sales (based-logistic)' })
  @ApiJsonResponse({
    type: BasedProductSaleResponseDto,
    isArray: true,
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.productsales.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductSaleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetProductSaleDto) {
    return await this.service.findAll(user, filter);
  }
}

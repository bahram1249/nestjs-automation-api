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
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { CartableWarrantyServiceTypeService } from './warranty-service-type.service';
import { GetWarrantyServiceTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-WarrantyServiceType')
@Controller({
  path: '/api/guarantee/cartable/warrantyServiceTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CartableWarrantyServiceTypeController {
  constructor(private service: CartableWarrantyServiceTypeService) {}

  @ApiOperation({ description: 'show all warranty service type' })
  @Get('/request/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GetWarrantyServiceTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GetWarrantyServiceTypeDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiJsonResponse } from '@rahino/response';
import { GoldPriceService } from './gold-price.service';
import { GoldPriceItemResponseDto, GoldCurrentPriceResponseDto } from './dto';

@ApiTags('GoldPrices')
@Controller({
  path: '/api/ecommerce/goldPrices',
  version: ['1'],
})
export class GoldPriceController {
  constructor(private service: GoldPriceService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'get all prices' })
  @ApiJsonResponse({ type: GoldPriceItemResponseDto, isArray: true })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'gold current price' })
  @ApiJsonResponse({ type: GoldCurrentPriceResponseDto })
  @Get('/goldCurrentPrice')
  @HttpCode(HttpStatus.OK)
  async findOne() {
    return await this.service.goldCurrentPrice();
  }
}

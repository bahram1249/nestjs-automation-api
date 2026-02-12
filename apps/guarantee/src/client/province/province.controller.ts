import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { GuaranteeClientProvinceListResponseDto } from './dto';

@ApiTags('GS-Provinces')
@Controller({
  path: '/api/guarantee/client/provinces',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ProvinceController {
  constructor(private service: ProvinceService) {}

  @ApiOperation({ description: 'show all provinces' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiJsonResponse({ type: GuaranteeClientProvinceListResponseDto })
  async findAll() {
    return await this.service.findAll();
  }
}

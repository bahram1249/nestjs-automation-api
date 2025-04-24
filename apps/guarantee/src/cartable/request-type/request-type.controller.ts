import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CartableRequestTypeService } from './request-type.service';
import { GetRequestTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RequestTypes')
@Controller({
  path: '/api/guarantee/cartable/requestTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CartableRequestTypeController {
  constructor(private service: CartableRequestTypeService) {}

  @ApiOperation({ description: 'show all request types' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetRequestTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetRequestTypeDto) {
    return await this.service.findAll(filter);
  }
}

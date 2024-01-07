import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetFilterDto } from './dto';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';

@Controller({
  path: '/api/discountcoffe/user/buffets',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class BuffetController {
  constructor(private service: BuffetService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: BuffetFilterDto) {
    return await this.service.findAll(dto);
  }
}

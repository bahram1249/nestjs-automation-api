import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestTypeService } from './request-type.service';

@ApiTags('GS-RequestTypes')
@Controller({
  path: '/api/guarantee/client/requestTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RequestTypeController {
  constructor(private service: RequestTypeService) {}

  @ApiOperation({ description: 'show all request types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}

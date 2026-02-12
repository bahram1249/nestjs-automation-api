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
import { RequestTypeService } from './request-type.service';
import { GuaranteeClientRequestTypeResponseDto } from './dto';

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
  @ApiJsonResponse({
    type: GuaranteeClientRequestTypeResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GuaranteeCheckService } from './guarantee-check.service';

@ApiTags('Anonymous-GuaranteeCheck')
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/anonymous/guaranteeCheck',
  version: ['1'],
})
export class GuaranteeCheckController {
  constructor(private service: GuaranteeCheckService) {}

  @ApiOperation({ description: 'get guarantee detail by serialNumber' })
  @Get('/serialNumber/:serialNumber')
  @HttpCode(HttpStatus.OK)
  async getDetail(@Param('serialNumber') serialNumber: string) {
    return await this.service.getDetail(serialNumber);
  }
}

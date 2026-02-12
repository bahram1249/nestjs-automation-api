import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiJsonResponse } from '@rahino/response';
import { AnonymousPublicReportService } from './public-report.service';
import { GuaranteeAnonymousPublicReportResponseDto } from './dto';

@ApiTags('GS-Anonymous-PublicReport')
@Controller({
  path: '/api/guarantee/anonymous/publicReports',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PublicReportController {
  constructor(private service: AnonymousPublicReportService) {}

  @ApiOperation({ description: 'public reports' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiJsonResponse({ type: GuaranteeAnonymousPublicReportResponseDto })
  async findAll() {
    return await this.service.findAll();
  }
}

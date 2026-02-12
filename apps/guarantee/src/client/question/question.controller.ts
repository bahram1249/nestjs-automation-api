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
import { QuestionService } from './question.service';
import { GuaranteeClientQuestionListResponseDto } from './dto';

@ApiTags('GS-Client-Questions')
@Controller({
  path: '/api/guarantee/client/questions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class QuestionController {
  constructor(private service: QuestionService) {}

  @ApiOperation({ description: 'show all questions' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiJsonResponse({ type: GuaranteeClientQuestionListResponseDto })
  async findAll() {
    return await this.service.findAll();
  }
}

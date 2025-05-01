import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { SubmitSurveyDto } from './dto';
import { User } from '@rahino/database';
import { SubmitSurveyService } from './submit-survey.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientSubmitSurvey')
@Controller({
  path: '/api/guarantee/client/submitSurvey',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubmitSurveyController {
  constructor(private service: SubmitSurveyService) {}

  @ApiOperation({ description: 'submit survey' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: SubmitSurveyDto) {
    return await this.service.traverse(user, dto);
  }
}

import { IsArray } from 'class-validator';
import { ResponsesDto } from './responses.dto';

export class SubmitSurveyDetailDto {
  @IsArray()
  repsponses: ResponsesDto[];
}

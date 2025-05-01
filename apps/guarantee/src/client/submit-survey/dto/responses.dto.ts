import { IsNumber } from 'class-validator';

export class ResponsesDto {
  @IsNumber()
  questionId: number;
  @IsNumber()
  answerOptionId: number;
}

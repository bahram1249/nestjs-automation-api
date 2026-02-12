import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientQuestionAnswerOptionResponseDto {
  @ApiProperty({ example: 1, description: 'Answer Option ID' })
  id: bigint;

  @ApiProperty({ example: 'Answer Title', description: 'Answer title' })
  title: string;
}

export class GuaranteeClientQuestionResponseDto {
  @ApiProperty({ example: 1, description: 'Question ID' })
  id: bigint;

  @ApiProperty({ example: 'Question Title', description: 'Question title' })
  title: string;

  @ApiProperty({
    example: 10.5,
    description: 'Maximum weight',
    required: false,
  })
  maxWeight?: number;

  @ApiProperty({
    type: [GuaranteeClientQuestionAnswerOptionResponseDto],
    description: 'Answer options',
    required: false,
  })
  answerOptions?: GuaranteeClientQuestionAnswerOptionResponseDto[];
}

export class GuaranteeClientQuestionListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientQuestionResponseDto],
    description: 'List of questions',
  })
  result: GuaranteeClientQuestionResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

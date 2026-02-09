import { ApiProperty } from '@nestjs/swagger';
import { GSQuestion, GSAnswerOption } from '@rahino/localdatabase/models';

export class GuaranteeAdminResponseUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Username',
    required: false,
  })
  username?: string;
}

export class GuaranteeAdminAnswerRecordResponseDto {
  @ApiProperty({ example: 1, description: 'Answer Record ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Response ID' })
  responseId: bigint;

  @ApiProperty({ example: 1, description: 'Question ID' })
  questionId: bigint;

  @ApiProperty({
    type: () => GSQuestion,
    description: 'Question',
    required: false,
  })
  question?: GSQuestion;

  @ApiProperty({ example: 1, description: 'Answer Option ID' })
  answerOptionId: bigint;

  @ApiProperty({
    type: () => GSAnswerOption,
    description: 'Answer Option',
    required: false,
  })
  answerOption?: GSAnswerOption;

  @ApiProperty({ example: 5.0, description: 'Weight' })
  weight: number;
}

export class GuaranteeAdminResponseDto {
  @ApiProperty({ example: 1, description: 'Response ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Request ID' })
  requestId: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({
    type: () => GuaranteeAdminResponseUserResponseDto,
    description: 'User information',
    required: false,
  })
  user?: GuaranteeAdminResponseUserResponseDto;

  @ApiProperty({ example: 50.0, description: 'From score' })
  fromScore: number;

  @ApiProperty({ example: 100.0, description: 'Total score', required: false })
  totalScore?: number;

  @ApiProperty({
    type: () => [GuaranteeAdminAnswerRecordResponseDto],
    description: 'Answer records',
    required: false,
  })
  answerRecords?: GuaranteeAdminAnswerRecordResponseDto[];
}

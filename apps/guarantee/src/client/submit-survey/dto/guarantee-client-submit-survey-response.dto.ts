import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientSubmitSurveyResponseDto {
  @ApiProperty({ type: Object, description: 'Response message' })
  result: {
    message: string;
  };
}

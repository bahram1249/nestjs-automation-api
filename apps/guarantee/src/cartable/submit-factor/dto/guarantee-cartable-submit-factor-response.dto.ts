import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableSubmitFactorResultDto {
  @ApiProperty({ example: 'core.success', description: 'Success message' })
  message: string;
}

export class GuaranteeCartableSubmitFactorResponseDto {
  @ApiProperty({
    type: GuaranteeCartableSubmitFactorResultDto,
    description: 'Submit factor result',
  })
  result: GuaranteeCartableSubmitFactorResultDto;
}

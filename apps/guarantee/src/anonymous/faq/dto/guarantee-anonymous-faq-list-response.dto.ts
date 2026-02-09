import { ApiProperty } from '@nestjs/swagger';
import { GSFaq } from '@rahino/localdatabase/models';

export class GuaranteeAnonymousFaqListResponseDto {
  @ApiProperty({
    type: [GSFaq],
    description: 'List of FAQs',
  })
  result: GSFaq[];

  @ApiProperty({
    type: Number,
    description: 'Total count of FAQs',
  })
  total: number;
}

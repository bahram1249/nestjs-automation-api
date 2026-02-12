import { ApiProperty } from '@nestjs/swagger';
import { GSVipBundleType } from '@rahino/localdatabase/models';

export class GuaranteeAnonymousVipBundleTypeListResponseDto {
  @ApiProperty({
    type: [GSVipBundleType],
    description: 'List of VIP bundle types',
  })
  result: GSVipBundleType[];

  @ApiProperty({
    type: Number,
    description: 'Total count of VIP bundle types',
  })
  total: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { GSVipBundleType } from '@rahino/localdatabase/models';

export class GuaranteeAnonymousVipBundleTypeResponseDto {
  @ApiProperty({
    type: GSVipBundleType,
    description: 'VIP bundle type details',
  })
  result: GSVipBundleType;
}

import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAnonymousSubscriptionResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      subscriptionDetail: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string' },
        },
      },
      message: { type: 'string' },
    },
    description: 'Subscription result with phone number and success message',
  })
  result: {
    subscriptionDetail: {
      phoneNumber: string;
    };
    message: string;
  };
}

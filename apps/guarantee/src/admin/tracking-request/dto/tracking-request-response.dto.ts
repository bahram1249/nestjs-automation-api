import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminTrackingRequestUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;
}

export class GuaranteeAdminTrackingRequestCurrentStateResponseDto {
  @ApiProperty({ example: 'Activity Name', description: 'Activity name' })
  activityName: string;

  @ApiProperty({
    type: [GuaranteeAdminTrackingRequestUserResponseDto],
    description: 'List of users',
  })
  users: GuaranteeAdminTrackingRequestUserResponseDto[];
}

export class GuaranteeAdminTrackingRequestCurrentStateListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminTrackingRequestCurrentStateResponseDto],
    description: 'List of current states',
  })
  result: GuaranteeAdminTrackingRequestCurrentStateResponseDto[];
}

export class GuaranteeAdminTrackingRequestListResponseDto {
  @ApiProperty({ description: 'List of tracking requests' })
  result: any[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

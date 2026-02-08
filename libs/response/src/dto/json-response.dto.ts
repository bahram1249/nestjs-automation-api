import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

@ApiExtraModels()
export class JsonResponseDto<T> {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'req-uuid-string', description: 'Request ID' })
  reqId: string;

  @ApiProperty({ example: 'Success', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data', type: 'object' })
  result: T;

  @ApiProperty({
    example: '2026-02-07T12:00:00.000Z',
    description: 'Timestamp',
  })
  timestamp: string;

  @ApiProperty({ example: '/api/path', description: 'Request path' })
  path: string;

  @ApiProperty({
    example: 0,
    description: 'Total count for paginated responses',
  })
  total: number;
}

// Helper function to create wrapped schema reference
export function wrapResponseSchema(originalSchema: any): any {
  return {
    allOf: [
      {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 200 },
          reqId: { type: 'string', example: 'req-uuid-string' },
          message: { type: 'string', example: 'Success' },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: new Date().toISOString(),
          },
          path: { type: 'string', example: '' },
          total: { type: 'number', example: 0 },
        },
      },
      {
        type: 'object',
        properties: {
          result: originalSchema,
        },
      },
    ],
  };
}

import { ApiProperty } from '@nestjs/swagger';
import { HistoryOutputDto } from './history-output.dto';

export class GuaranteeCartableHistoryListResponseDto {
  @ApiProperty({
    type: [HistoryOutputDto],
    description: 'List of request history entries',
  })
  result: HistoryOutputDto[];

  @ApiProperty({ example: 10, description: 'Total count of history entries' })
  total: number;
}

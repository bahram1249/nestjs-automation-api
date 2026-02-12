import { ApiProperty } from '@nestjs/swagger';

export class InventoryStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory status ID' })
  id: number;

  @ApiProperty({ example: 'Available', description: 'Inventory status name' })
  name: string;
}

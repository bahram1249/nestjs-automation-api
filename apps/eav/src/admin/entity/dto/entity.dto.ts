import { IsNumber } from 'class-validator';

export class EntityDto {
  @IsNumber()
  entityTypeId: number;
}

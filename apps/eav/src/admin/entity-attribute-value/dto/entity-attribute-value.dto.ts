import { IsNumber, IsString } from 'class-validator';

export class EntityAttributeValueDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsString({ each: true })
  val: string | number;
}

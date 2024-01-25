import { IsNumber, IsString } from 'class-validator';

export class ProductAttributeDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsString({ each: true })
  val: string | number;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class GetLinkedEntityTypeBrandDto {
  @IsString()
  @IsNotEmpty()
  brandSlug: string;

  @IsString()
  @IsNotEmpty()
  entityTypeSlug: string;
}

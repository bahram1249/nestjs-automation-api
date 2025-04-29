import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SliderContentDto {
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  @AutoMap()
  public alt?: string;

  @IsNotEmpty()
  @AutoMap()
  public link: string;

  @IsNumber()
  @AutoMap()
  public imageAttachmentId: number;

  @IsNumber()
  @AutoMap()
  public mobileImageAttachmentId: number;
}

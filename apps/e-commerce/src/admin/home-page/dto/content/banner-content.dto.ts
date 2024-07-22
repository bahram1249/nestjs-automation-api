import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BannerContentDto {
  @IsNotEmpty()
  @AutoMap()
  public link: string;

  @IsNotEmpty()
  @AutoMap()
  @IsOptional()
  public alt?: string;

  @IsNumber()
  @AutoMap()
  public imageAttachmentId: number;
}

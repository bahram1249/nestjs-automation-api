import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BannerContentDto {
  @IsNotEmpty()
  @AutoMap()
  public link: string;

  @IsNumber()
  @AutoMap()
  public imageAttachmentId: number;
}

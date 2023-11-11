//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class MenuDto {
  @MinLength(3, {
    message: '',
  })
  @MaxLength(256, {
    message: '',
  })
  @IsNotEmpty({
    message: '',
  })
  //@AutoMap()
  title: string;

  @MinLength(3, {
    message: '',
  })
  @MaxLength(1024, {
    message: '',
  })
  @IsNotEmpty({
    message: '',
  })
  //@AutoMap()
  url: string;

  @MinLength(3, {
    message: '',
  })
  @MaxLength(256, {
    message: '',
  })
  @IsNotEmpty({
    message: '',
  })
  //@AutoMap()
  icon: string;

  @MinLength(3, {
    message: '',
  })
  @MaxLength(256, {
    message: '',
  })
  @IsNotEmpty({
    message: '',
  })
  //@AutoMap()
  className: string;

  //@AutoMap()
  @IsOptional()
  parentMenuId?: number;

  //@AutoMap()
  @IsOptional()
  order?: number;
}

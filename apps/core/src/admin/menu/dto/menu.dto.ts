import { ApiProperty } from '@nestjs/swagger';
//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class MenuDto {
  @ApiProperty({ example: 'Dashboard', description: 'Menu title' })
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

  @ApiProperty({ example: '/dashboard', description: 'Menu URL' })
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

  @ApiProperty({ example: 'home-icon', description: 'Menu icon class' })
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

  @ApiProperty({ example: 'menu-item', description: 'CSS class name' })
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

  @ApiProperty({ example: 1, description: 'Parent menu ID', required: false })
  //@AutoMap()
  @IsOptional()
  parentMenuId?: number;

  @ApiProperty({ example: 1, description: 'Menu order', required: false })
  //@AutoMap()
  @IsOptional()
  order?: number;
}

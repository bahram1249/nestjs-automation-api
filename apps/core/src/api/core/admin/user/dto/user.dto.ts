//import { AutoMap } from '@automapper/classes';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
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
  firstname: string;

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
  lastname: string;

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
  username: string;

  @IsEmail(
    {},
    {
      message: '',
    },
  )
  @IsOptional({
    message: '',
  })
  //@AutoMap()
  email: string;

  @IsOptional()
  //@AutoMap()
  phoneNumber: string;
  @IsOptional()
  roles: number[];

  @IsOptional()
  ignoreRole?: boolean;
}

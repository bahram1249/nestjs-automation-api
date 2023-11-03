//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class RoleDto {
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
  roleName: string;

  @IsOptional()
  permissions: number[];

  @IsOptional()
  ignorePermission?: boolean;
}

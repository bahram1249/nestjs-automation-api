import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_-.]{3,20}$/)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

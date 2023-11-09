import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UsernameDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_-.]{3,20}$/)
  username: string;
}

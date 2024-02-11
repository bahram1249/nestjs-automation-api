import { IsString } from 'class-validator';

export class UserPasswordDto {
  @IsString()
  currentPassword: string;
  @IsString()
  newPassword: string;
  @IsString()
  confirmPassword: string;
}

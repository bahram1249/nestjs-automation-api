//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class loginDto {
  @MinLength(3, {
    message: 'نام کاربری حداقل 3 کاراکتر میبایست باشد',
  })
  @MaxLength(25, {
    message: 'نام کاربری حداکثر 25 کاراکتر میبایست باشد',
  })
  @IsNotEmpty({
    message: 'نام کاربری الزامی میباشد',
  })
  //@AutoMap()
  username: string;

  @MinLength(6, {
    message: 'کلمه عبور حداقل 6 کاراکتر میبایست باشد',
  })
  @MaxLength(1024, {
    message: 'کلمه عبور حداکثر 1024 کاراکتر میبایست باشد',
  })
  @IsNotEmpty({
    message: 'کلمه عبور الزامی میباشد',
  })
  //@AutoMap()
  password: string;
}

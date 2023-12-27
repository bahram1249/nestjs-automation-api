//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class MenuCategoryDto {
  @MinLength(3, {
    message: 'حداقل کاراکتر عنوان میبایست 3 کاراکتر باشد',
  })
  @MaxLength(256, {
    message: 'حداکثر کاراکتر عنوان میبایست 256 کاراکتر باشد',
  })
  @IsNotEmpty({
    message: 'عنوان نمیتواند خالی باشد',
  })
  title: string;
}

//import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class MenuDto {
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

  @IsNotEmpty({
    message: 'کافه و رستوران میبایست انتخاب شود',
  })
  buffetId: bigint;
  @IsNotEmpty({
    message: 'دسته بندی منو بایستی انتخاب شود',
  })
  menuCategoryId: number;

  @IsNotEmpty({
    message: 'مبلغ میبایست وارد شود',
  })
  price: bigint;
}

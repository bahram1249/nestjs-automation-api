//import { AutoMap } from '@automapper/classes';
import { replaceCharacterSlug } from '@rahino/commontools';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BuffetDto {
  @MinLength(3, {
    message: 'حداقل کاراکتر نام صاحب کافه میبایست 3 کاراکتر باشد',
  })
  @MaxLength(256, {
    message: 'حداکثر کاراکتر نام صاحب کافه میبایست 256 کاراکتر باشد',
  })
  @IsNotEmpty({
    message: 'نام صاحب کافه نمیتواند خالی باشد',
  })
  firstname: string;

  @MinLength(3, {
    message: 'حداقل کاراکتر نام خانوادگی صاحب کافه میبایست 3 کاراکتر باشد',
  })
  @MaxLength(256, {
    message: 'حداکثر کاراکتر نام خانوادگی صاحب کافه میبایست 256 کاراکتر باشد',
  })
  @IsNotEmpty({
    message: 'نام خانوادگی صاحب کافه نمیتواند خالی باشد',
  })
  lastname: string;

  @MinLength(3, {
    message: 'حداقل کاراکتر نام کاربری صاحب کافه میبایست 3 کاراکتر باشد',
  })
  @MaxLength(256, {
    message: 'حداکثر کاراکتر نام کاربری صاحب کافه میبایست 256 کاراکتر باشد',
  })
  @IsNotEmpty({
    message: 'نام کاربری صاحب کافه نمیتواند خالی باشد',
  })
  username: string;

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
  @MinLength(3, {
    message: 'حداقل کاراکتر آدرس لینک میبایست 3 کاراکتر باشد',
  })
  @MaxLength(1024, {
    message: 'حداکثر کاراکتر آدرس لینک میبایست 1024 کاراکتر باشد',
  })
  @Transform(({ value }) => replaceCharacterSlug(value))
  @IsOptional()
  urlAddress?: string;

  @MinLength(1, {
    message: 'مشکلی در درصد تخفیف وجود دارد',
  })
  @MaxLength(3, {
    message: 'مشکلی در درصد تخفیف وجود دارد',
  })
  @IsOptional()
  percentDiscount?: string;

  @IsNumber()
  @Transform(({ value }) => JSON.parse(value))
  buffetTypeId: number;

  @IsOptional()
  buffetDescription?: string;

  @IsOptional()
  buffetAddress?: string;

  @IsOptional()
  buffetPhone?: string;

  @IsOptional()
  wazeLink?: string;

  @IsOptional()
  neshanLink?: string;

  @IsOptional()
  baladLink?: string;

  @IsOptional()
  googleMapLink?: string;

  @IsOptional()
  latitude?: string;

  @IsOptional()
  longitude?: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  buffetCostId?: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  cityId: number;

  @IsOptional()
  options?: number[] = [];

  @Transform(({ value }) => value == 'true')
  @IsOptional()
  @IsBoolean()
  pin?: boolean;

  @IsArray()
  @IsOptional()
  galleries: string[] = [];
}

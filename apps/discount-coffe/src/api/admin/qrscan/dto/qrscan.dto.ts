import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class QrScanDto {
  @MinLength(3, {
    message: 'حداقل کد رزرو میبایست 3 کاراکتر باشد',
  })
  @MaxLength(256, {
    message: 'حداکثر کد رزرو میبایست 256 کاراکتر باشد',
  })
  @IsNotEmpty({
    message: 'کد رزرو نمیتواند خالی باشد',
  })
  reserveId: string;
}

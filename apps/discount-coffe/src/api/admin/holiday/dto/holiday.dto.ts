import { IsNotEmpty } from 'class-validator';

export class HolidayDto {
  @IsNotEmpty({
    message: 'تاریخ تعطیلی نمیتواند خالی باشد',
  })
  ignoreDate: string;
}

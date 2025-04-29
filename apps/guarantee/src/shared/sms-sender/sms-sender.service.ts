import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SmsSenderDto } from './dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsSenderService {
  constructor(private readonly configService: ConfigService) {}

  async sendSms(dto: SmsSenderDto) {
    const message = encodeURIComponent(
      `${dto.message}\nhttps://club.ariakish.com\nلغو11`,
    );
    //const message = `${dto.message} %0D%0A لغو11`;
    const res = await axios.get(
      `https://p.1000sms.ir/url/post/SendSMS.ashx.php?username=${this.configService.get(
        'RAHYAB_URL_USERNAME',
      )}&password=${this.configService.get(
        'RAHYAB_URL_PASSWORD',
      )}&from=${this.configService.get('RAHYAB_URL_FROM')}&to=${
        dto.phoneNumber
      }&text=${message}`,
    );

    const trigger = res.data as string;
    const regexp = new RegExp('^[01]{1}-\\d+$');
    if (!regexp.test(trigger)) {
      throw new InternalServerErrorException(`sms not send ${res.data}`);
    }
  }
}

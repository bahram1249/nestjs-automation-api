import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMS_SERVICE } from '@rahino/sms/contants';
import { SmsService } from '@rahino/sms/sms.service';

@Injectable()
export class ECommmerceSmsService {
  constructor(
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsService,
    private readonly config: ConfigService,
  ) {}

  async loginSms(text: string, to: string) {
    const loginBody = this.config.get('ECOMMERCE_LOGIN_SMS_CODE');
    await this.smsService.sendMessage({
      text: text,
      to: to,
      bodyId: loginBody,
    });
  }

  async processOrder(text: string, to: string) {
    const activeSms = await this.config.get(
      'ECOMMERCE_PROCESSED_SMS_CODE_STATUS',
    );
    if (activeSms == true) {
      const processCode = this.config.get('ECOMMERCE_PROCESSED_SMS_CODE');
      await this.smsService.sendMessage({
        text: text,
        to: to,
        bodyId: processCode,
      });
    }
  }
}

import { Injectable } from '@nestjs/common';
import { MeliPayamakService } from '../services/melipayamak.service';
import { SmsService } from '../sms.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsProviderFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly meliPayamakService: MeliPayamakService,
  ) {}

  create(): SmsService {
    const username = this.config.get('SMS_USERNAME');
    const password = this.config.get('SMS_PASSWORD');
    return new SmsService(username, password, this.meliPayamakService);
  }
}

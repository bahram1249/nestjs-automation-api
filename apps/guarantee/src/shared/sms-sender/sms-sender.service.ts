import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as soap from 'soap';
import axios from 'axios';
import { SmsSenderDto } from './dto';

@Injectable()
export class SmsSenderService {
  private client: soap.Client;

  constructor(private readonly configService: ConfigService) {}

  private async getClient(): Promise<soap.Client> {
    if (!this.client) {
      this.client = await soap.createClientAsync(
        'https://linepayamak.ir/Post/Send.asmx?wsdl',
        { request: axios.create({ timeout: 15000 }) },
      );
    }
    return this.client;
  }

  private normalizeMobile(mobile: string): string {
    let m = mobile.replace(/\D/g, '');

    // same as PHP: independent rules (NOT else-if)
    if (m.startsWith('0')) {
      m = '98' + m.substring(1);
    }

    if (m.length === 10) {
      m = '98' + m;
    }

    return m;
  }

  async sendSms(dto: SmsSenderDto) {
    const client = await this.getClient();
    const mobile = dto.phoneNumber;

    const text = dto.message + '\nhttps://club.ariakish.com\nلغو11';

    const parameters = {
      username: this.configService.get('RAHYAB_URL_USERNAME'),
      password: this.configService.get('RAHYAB_URL_PASSWORD'),
      from: this.configService.get('RAHYAB_URL_FROM'),
      to: { string: [mobile] }, // ← FIX: wrap in <string>
      text,
      isflash: false,
      udh: '',
      recId: { int: [0] }, // ← FIX: wrap in <int>
      status: { int: [0] }, // ← FIX: wrap in <int>
    };

    console.log(parameters);
    try {
      const [response] = await client.SendSmsAsync(parameters);
      console.log('response:', response);

      const retval = response?.SendSmsResult ?? null;
      console.log('retval:', retval);

      const statusMessages: Record<number, string> = {
        0: 'InvalidUserPass',
        1: 'Successfull',
        2: 'NoCredit',
        3: 'DailyLimit',
        4: 'SendLimit',
        5: 'InvalidNumber',
      };

      if (retval !== 1) {
        const errorMsg =
          statusMessages[retval] ?? `Unknown error (code: ${retval})`;
        throw new Error(`SMS not sent: ${errorMsg}`);
      }

      const recIds = (response?.recId ?? []) as number[];
      return '1-' + (recIds[0] ?? '0');
    } catch (e) {
      throw e;
    }
  }

  async sendBulkSms(message: string, mobiles: string[]) {
    const client = await this.getClient();
    const normalizedMobiles = mobiles.map((m) => this.normalizeMobile(m));
    const text = `${message}\nhttps://club.ariakish.com\nلغو11`;

    const parameters = {
      username: this.configService.get('RAHYAB_URL_USERNAME'),
      password: this.configService.get('RAHYAB_URL_PASSWORD'),
      from: this.configService.get('RAHYAB_URL_FROM'),
      to: { string: normalizedMobiles }, // ← FIX
      text,
      isflash: false,
      udh: '',
      recId: { int: normalizedMobiles.map(() => 0) }, // ← FIX
      status: { int: normalizedMobiles.map(() => 0) }, // ← FIX
    };

    const [result] = await client.SendSmsAsync(parameters);
    const retval = result?.SendSmsResult as number;

    const statusMessages: Record<number, string> = {
      0: 'InvalidUserPass',
      1: 'Successfull',
      2: 'NoCredit',
      3: 'DailyLimit',
      4: 'SendLimit',
      5: 'InvalidNumber',
    };

    if (retval !== 1) {
      const errorMsg =
        statusMessages[retval] ?? `Unknown error (code: ${retval})`;
      throw new InternalServerErrorException(`Bulk SMS not sent: ${errorMsg}`);
    }

    return {
      success: true,
      retval,
      recIds: (result?.recId as number[]) ?? [],
      statuses: (result?.status as number[]) ?? [],
    };
  }
}

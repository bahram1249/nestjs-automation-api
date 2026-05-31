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
    let normalized = mobile.replace(/[^0-9]/g, '');
    if (normalized.startsWith('0')) {
      normalized = '98' + normalized.substring(1);
    }
    if (normalized.length === 10) {
      normalized = '98' + normalized;
    }
    return normalized;
  }

  async sendSms(dto: SmsSenderDto) {
    const client = await this.getClient();
    const mobile = this.normalizeMobile(dto.phoneNumber);
    const text = `${dto.message}\nhttps://club.ariakish.com\nلغو11`;

    const parameters = {
      username: this.configService.get('RAHYAB_URL_USERNAME'),
      password: this.configService.get('RAHYAB_URL_PASSWORD'),
      from: this.configService.get('RAHYAB_URL_FROM'),
      to: [mobile],
      text,
      isflash: false,
      udh: '',
      recId: [0],
      status: [0],
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
      throw new InternalServerErrorException(`SMS not sent: ${errorMsg}`);
    }

    const recIds = result?.recId as number[];
    return `1-${recIds?.[0] ?? '0'}`;
  }

  async sendBulkSms(message: string, mobiles: string[]) {
    const client = await this.getClient();
    const normalizedMobiles = mobiles.map((m) => this.normalizeMobile(m));
    const text = `${message}\nhttps://club.ariakish.com\nلغو11`;

    const parameters = {
      username: this.configService.get('RAHYAB_URL_USERNAME'),
      password: this.configService.get('RAHYAB_URL_PASSWORD'),
      from: this.configService.get('RAHYAB_URL_FROM'),
      to: normalizedMobiles,
      text,
      isflash: false,
      udh: '',
      recId: normalizedMobiles.map(() => 0),
      status: normalizedMobiles.map(() => 0),
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

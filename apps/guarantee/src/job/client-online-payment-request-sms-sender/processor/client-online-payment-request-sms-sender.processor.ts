import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_ONLINE_PAYMENT_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(CLIENT_ONLINE_PAYMENT_REQUEST_SMS_SENDER_QUEUE)
export class ClientOnlinePaymentRequestSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `${job.data.firstname} ${job.data.lastname} عزیز، لطفا با مراجعه به پنل کاربری خود فاکتور ایجاد شده در بخش اقدام درخواست های خود را پرداخت نمایید.`;
      await this.smsSenderService.sendSms({
        phoneNumber: job.data.phoneNumber,
        message: template,
      });
    } catch (error) {
      return Promise.reject(error.message);
    }
    return Promise.resolve(true);
  }
}

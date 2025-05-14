import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE)
export class NewIncomingCartableRequestSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `${job.data.firstname} ${job.data.lastname} عزیز درخواست جدیدی با شماره ${job.data.requestId} در کارتابل شما ثبت شده است.`;
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

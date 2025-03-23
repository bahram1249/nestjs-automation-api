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
      const template = `آقا/خانم ${job.data.firstName} ${job.data.lastName} درخواست جدیدی در کارتابل شما ثبت شده است.`;
      await this.smsSenderService.sendSms({
        phoneNumber: job.data.phoneNumber,
        message: template,
      });
    } catch (error) {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}

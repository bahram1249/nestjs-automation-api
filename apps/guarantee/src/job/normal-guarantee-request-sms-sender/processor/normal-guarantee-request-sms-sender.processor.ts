import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE)
export class NormalGuaranteeRequestSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `مشتری گرامی درخواست شما در کلاب آریاکیش ثبت گردید و پس از بررسی و تایید، با شما تماس گرفته خواهد شد.`;
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

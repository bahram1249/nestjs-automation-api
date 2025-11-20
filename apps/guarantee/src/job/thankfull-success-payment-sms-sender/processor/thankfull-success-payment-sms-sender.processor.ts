import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '../constants';

@Processor(THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE)
export class ThankfullSuccessPaymentSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `${job.data.firstname} ${job.data.lastname} عزیز از پرداخت شما در کلاب آریاکیش متشکریم`;
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

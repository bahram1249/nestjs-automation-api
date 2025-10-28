import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE)
export class ClientSubmitCardSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `جناب آقای/خانم ${job.data.firstname} ${job.data.lastname}، کارت گارانتی شما با شماره ${job.data.serialNumber} با موفقیت ثبت گردید. از اعتماد شما سپاسگزاریم`;
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

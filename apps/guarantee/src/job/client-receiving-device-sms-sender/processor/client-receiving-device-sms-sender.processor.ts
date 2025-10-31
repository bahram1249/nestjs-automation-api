import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE)
export class ClientReceivingDeviceSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `${job.data.firstname} ${job.data.lastname} عزیز، دستگاه شما در تاریخ ${job.data.currentDate} در نمایندگی تحویل شد.`;
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

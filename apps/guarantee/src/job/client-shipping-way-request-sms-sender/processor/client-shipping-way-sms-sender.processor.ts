import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_SHIPPING_WAY_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(CLIENT_SHIPPING_WAY_REQUEST_SMS_SENDER_QUEUE)
export class ClientShippingWaySmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const template = `آقا/خانم ${job.data.firstname} ${job.data.lastname} لطفا با مراجعه به پنل کاربری خود نحوه ارسال کالا به آدرس مشخص شده را اعلام فرمایید و کالای خود را به نماینده ارسال فرمایید.`;
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

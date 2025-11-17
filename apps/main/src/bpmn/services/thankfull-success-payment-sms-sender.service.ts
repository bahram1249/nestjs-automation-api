import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/thankfull-success-payment-sms-sender/constants';
import { GetUser } from '@rahino/auth';

@Injectable()
export class ThankfullSuccessPaymentSmsSenderService {
  constructor(
    @InjectQueue(THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  async execute(data: any, user: GetUser) {
    await this.smsQueue.add('sendThankYouSms', {
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    });
  }
}

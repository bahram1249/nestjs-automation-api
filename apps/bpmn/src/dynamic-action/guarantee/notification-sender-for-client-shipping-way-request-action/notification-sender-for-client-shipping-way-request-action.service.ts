import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { User } from '@rahino/database';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { CLIENT_SHIPPING_WAY_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-shipping-way-request-sms-sender/constants';

@Injectable()
export class NotificationSenderForClientShippingWayRequestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,

    @InjectQueue(CLIENT_SHIPPING_WAY_REQUEST_SMS_SENDER_QUEUE)
    private readonly clientShippingWayRequestSmsSenderQueue: Queue,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          },
        ])
        .filter({ id: dto.request.id })
        .build(),
    );

    await this.sendNotification(request.user);
  }

  private async sendNotification(user: User) {
    await this.clientShippingWayRequestSmsSenderQueue.add(
      'send-client-shipping-way-request-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
      },
    );
  }
}

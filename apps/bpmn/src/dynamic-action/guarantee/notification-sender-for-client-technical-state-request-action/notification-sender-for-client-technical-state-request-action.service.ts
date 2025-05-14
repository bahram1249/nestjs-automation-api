import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { User } from '@rahino/database';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { CLIENT_TECHNICAL_STATE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-technical-state-request-sms-sender/constants';

@Injectable()
export class NotificationSenderForClientTechnicalStateRequestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,

    @InjectQueue(CLIENT_TECHNICAL_STATE_REQUEST_SMS_SENDER_QUEUE)
    private readonly clientSmsSenderQueue: Queue,
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
        .transaction(dto.transaction)
        .build(),
    );

    await this.sendNotification(request.user);
  }

  private async sendNotification(user: User) {
    await this.clientSmsSenderQueue.add(
      'send-client-technical-state-request-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
      },
    );
  }
}

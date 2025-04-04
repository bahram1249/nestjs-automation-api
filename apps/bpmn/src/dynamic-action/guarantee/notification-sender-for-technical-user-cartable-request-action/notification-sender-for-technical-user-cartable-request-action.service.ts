import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { PersianDate, User } from '@rahino/database';
import { TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/technical-user-cartable-request-sms-sender/constants';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { NotificationSenderForTechnicalUserDto } from './dto';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class NotificationSenderForTechnicalUserCartableRequestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectQueue(TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE)
    private readonly superVisorCartableRequestSmsSenderQueue: Queue,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.request.id })
        .include([
          {
            model: User,
            as: 'technicalUser',
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          },
        ])
        .transaction(dto.transaction)
        .build(),
    );
    const data: NotificationSenderForTechnicalUserDto = {
      date: request.technicalUserVisitDate,
      time: request.technicalUserVisitTime,
      requestTypeId: request.requestTypeId,
    };

    await this.sendNotification(request.technicalUser, data);
  }

  private async sendNotification(
    user: User,
    data: NotificationSenderForTechnicalUserDto,
  ) {
    const persianDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.eq]: Sequelize.literal(
              `'${moment(data.date).format('YYYY-MM-DD')}'`,
            ),
          }),
        )
        .build(),
    );
    await this.superVisorCartableRequestSmsSenderQueue.add(
      'send-super-visor-cartable-request-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        date: persianDate.DayNameInYear,
        time: data.time,
        requestTypeId: data.requestTypeId,
      },
    );
  }
}

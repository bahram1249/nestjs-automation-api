import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { PersianDate, User, UserRole } from '@rahino/database';
import { SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/supervisor-cartable-request-sms-sender/constants';
import { BPMNOrganizationUser, GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { NotificationSenderForSuperVisorDto } from './dto';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment-jalaali';

@Injectable()
export class NotificationSenderForSupervisorCartableRquestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectQueue(SUPERVISOR_CARTABLE_REQUEST_SMS_SENDER_QUEUE)
    private readonly superVisorCartableRequestSmsSenderQueue: Queue,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.request.id }).build(),
    );
    const data: NotificationSenderForSuperVisorDto = {
      date: request.superVisorVisitDate,
      time: request.superVisorVisitTime,
      requestTypeId: request.requestTypeId,
    };
    if (
      dto.requestState.organizationId != null &&
      dto.requestState.roleId != null
    ) {
      const organizationUsers = await this.organizationUserRepository.findAll(
        new QueryOptionsBuilder()
          .include({
            model: User,
            as: 'user',
            required: true,
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          })
          .filter({ organizationId: dto.requestState.organizationId })
          .filter({ roleId: dto.requestState.roleId })
          .build(),
      );
      await this.sendNotificationToOrganizationUsers(organizationUsers, data);
    } else if (dto.requestState.roleId != null) {
      const userRoles = await await this.userRoleRepository.findAll(
        new QueryOptionsBuilder()
          .include({
            model: User,
            as: 'user',
            required: true,
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          })
          .filter({ roleId: dto.requestState.roleId })
          .build(),
      );
      await this.sendNotificationToUserRoles(userRoles, data);
    } else if (dto.requestState.userId != null) {
      const user = await this.userRepository.findOne(
        new QueryOptionsBuilder()
          .attributes(['id', 'firstname', 'lastname', 'phoneNumber'])
          .filter({ id: dto.requestState.userId })
          .build(),
      );
      await this.sendNotification(user, data);
    }
  }

  private async sendNotificationToOrganizationUsers(
    bpmnOrganizationUsers: BPMNOrganizationUser[],
    data: NotificationSenderForSuperVisorDto,
  ) {
    for (const bpmnOrganizationUser of bpmnOrganizationUsers) {
      await this.sendNotification(bpmnOrganizationUser.user, data);
    }
  }

  private async sendNotificationToUserRoles(
    userRoles: UserRole[],
    data: NotificationSenderForSuperVisorDto,
  ) {
    for (const userRole of userRoles) {
      await this.sendNotification(userRole.user, data);
    }
  }

  private async sendNotification(
    user: User,
    data: NotificationSenderForSuperVisorDto,
  ) {
    const convertDateFormat = '103';
    const persianDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.eq]: Sequelize.fn(
              'convert',
              Sequelize.literal('date'),
              `${moment()
                .tz('Asia/Tehran', false)
                .locale('fa')
                .format('jYYYY-jMM-jDD')}`,
              convertDateFormat,
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

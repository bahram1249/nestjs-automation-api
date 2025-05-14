import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { User, UserRole } from '@rahino/database';
import { NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/new-incoming-cartable-request-sms-sender/constants';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationSenderForNewIncomingCartableRequestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectQueue(NEW_INCOMING_CARTABLE_REQUEST_SMS_SENDER_QUEUE)
    private readonly newIncomingCartableRequestSmsSenderQueue: Queue,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
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
      await this.sendNotificationToOrganizationUsers(
        dto.request.id,
        organizationUsers,
      );
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
      await this.sendNotificationToUserRoles(dto.request.id, userRoles);
    } else if (dto.requestState.userId != null) {
      const user = await this.userRepository.findOne(
        new QueryOptionsBuilder()
          .attributes(['id', 'firstname', 'lastname', 'phoneNumber'])
          .filter({ id: dto.requestState.userId })
          .build(),
      );
      await this.sendNotification(dto.request.id, user);
    }
  }

  private async sendNotificationToOrganizationUsers(
    requestId: bigint,
    bpmnOrganizationUsers: BPMNOrganizationUser[],
  ) {
    for (const bpmnOrganizationUser of bpmnOrganizationUsers) {
      await this.sendNotification(requestId, bpmnOrganizationUser.user);
    }
  }

  private async sendNotificationToUserRoles(
    requestId: bigint,
    userRoles: UserRole[],
  ) {
    for (const userRole of userRoles) {
      await this.sendNotification(requestId, userRole.user);
    }
  }

  private async sendNotification(requestId: bigint, user: User) {
    await this.newIncomingCartableRequestSmsSenderQueue.add(
      'send-incoming-cartable-request-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        requestId: requestId,
      },
    );
  }
}

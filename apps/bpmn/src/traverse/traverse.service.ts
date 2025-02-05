import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNNode,
  BPMNNodeCommand,
  BPMNNodeCommandType,
  BPMNPROCESS,
  BPMNRequestState,
  UserRole,
} from '@rahino/database';
import {
  AutoTraverseDto,
  FindReferralTypeDto,
  TraverseDto,
  UserTraverseDto,
} from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ReferralTypeEnum } from '../referral-type';
import { NodeCommandTypeEnum } from '../node-command-type';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ConditionService } from '../condition';
import { ActionService } from '../action';
import { RequestStateService } from '../request-state';
import { ActivityTypeEnum } from '../activity-type';

@Injectable()
export class TraverseService {
  constructor(
    @InjectModel(BPMNPROCESS)
    private readonly processRepository: typeof BPMNPROCESS,
    @InjectModel(BPMNNode)
    private readonly nodeRepository: typeof BPMNNode,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    private readonly requestStateService: RequestStateService,
    private readonly conditionService: ConditionService,
    private readonly actionService: ActionService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async traverse(dto: TraverseDto) {
    const users = await this.findReferralUsers({
      users: dto.users,
      node: dto.node,
    });
    // check conditions
    const conditionResult = await this.conditionService.checkConditions({
      request: dto.request,
      requestState: dto.requestState,
      node: dto.node,
      transaction: dto.transaction,
    });

    // failed conditions
    if (!conditionResult && dto.node.conditionFailedActionRunnerId) {
      await this.actionService.runAction({
        actionId: dto.node.conditionFailedActionRunnerId,
        request: dto.request,
        requestState: dto.requestState,
        transaction: dto.transaction,
      });
    }

    if (!conditionResult) return;

    // outbound actions of current state

    // inbound action of next state

    for (const user of users) {
      const newRequestState = await this.requestStateRepository.create(
        {
          requestId: dto.request.id,
          activityId: dto.node.toActivityId,
          organizationId: dto.request.organizationId,
          userId: user.userId,
          returnRequestStateId: dto.requestState.returnRequestStateId,
        },
        { transaction: dto.transaction },
      );

      // create request histories

      if (
        dto.node.toActivity.activityTypeId == ActivityTypeEnum.SubProcessState
      ) {
        if (dto.node.toActivity.insideProcessRunnerId == null) {
          throw new BadRequestException('UndefinedInsideProcessRunnerId');
        }
        const subProcessState = await this.requestStateService.initRequestState(
          {
            processId: dto.node.toActivity.insideProcessRunnerId,
            request: dto.request,
            returnRequestStateId: newRequestState.id,
            transaction: dto.transaction,
          },
        );
        await this.autoTraverse({
          request: dto.request,
          requestState: subProcessState,
          transaction: dto.transaction,
        });
      } else {
        await this.autoTraverse({
          request: dto.request,
          requestState: newRequestState,
          transaction: dto.transaction,
        });
      }
    }

    await this.requestStateRepository.destroy({
      where: {
        requestId: dto.request.id,
        id: dto.requestState.id,
      },
      transaction: dto.transaction,
    });
  }

  async autoTraverse(dto: AutoTraverseDto) {
    // find all nextAutoNode with submit nodeCommandType
    const nextAutoNodes = await this.nodeRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: BPMNNodeCommand,
            as: 'nodeCommands',
            required: true,
            where: {
              [Op.and]: [
                {
                  nodeCommandTypeId: NodeCommandTypeEnum.Submit,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('nodeCommands.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
            include: [
              {
                model: BPMNNodeCommandType,
                as: 'nodeCommandType',
              },
            ],
          },
          {
            model: BPMNActivity,
            as: 'fromActivity',
            include: [
              {
                model: BPMNPROCESS,
                as: 'process',
              },
            ],
          },
          {
            model: BPMNActivity,
            as: 'toActivity',
            include: [
              {
                model: BPMNPROCESS,
                as: 'process',
              },
            ],
          },
        ])
        .filter({ fromActivityId: dto.requestState.activityId })
        .filter({ autoIterate: true })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNNode.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    for (const nextAutoNode of nextAutoNodes) {
      for (const nodeCommand of nextAutoNode.nodeCommands) {
        await this.traverse({
          request: dto.request,
          requestState: dto.requestState,
          node: nextAutoNode,
          nodeCommand: nodeCommand,
          transaction: dto.transaction,
        });
      }
    }
  }

  private async findReferralUsers(
    dto: FindReferralTypeDto,
  ): Promise<UserTraverseDto[]> {
    const referralStrategies = {
      [ReferralTypeEnum.Direct]: () => this.handleDirectReferral(dto),
      [ReferralTypeEnum.Role]: () => this.handleRoleReferral(dto),
    };

    const strategy = referralStrategies[dto.node.referralTypeId];
    const users = strategy ? await strategy() : [];

    if (users.length === 0) {
      throw new BadRequestException(
        this.i18n.translate('bpmn.cannot_find_any_referral_user', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return users;
  }

  private handleDirectReferral(dto: FindReferralTypeDto): UserTraverseDto[] {
    const nodeProvidedUsers: UserTraverseDto[] = [];
    if (dto.node.userId) {
      nodeProvidedUsers.push({ userId: dto.node.userId });
    }
    return dto.users ?? nodeProvidedUsers;
  }

  private async handleRoleReferral(
    dto: FindReferralTypeDto,
  ): Promise<UserTraverseDto[]> {
    if (dto.node.roleId == null) {
      throw new BadRequestException(
        this.i18n.translate('bpmn.node_has_not_assigned_any_roles', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let userRoles = await this.userRoleRepository.findAll(
      new QueryOptionsBuilder().filter({ roleId: dto.node.roleId }).build(),
    );

    if (dto.users != null && dto.users.length > 0) {
      userRoles = userRoles.filter((userRole) =>
        dto.users.some((user) => user.userId === userRole.userId),
      );
    }

    return userRoles.map(
      (userRole): UserTraverseDto => ({ userId: userRole.userId }),
    );
  }
}

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
  NewStateReachedDto,
  TraverseBasedDirectUserDto,
  TraverseBasedReferralDto,
  TraverseBasedRoleDto,
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
    // check conditions
    const conditionResult = await this.conditionService.checkConditions({
      request: dto.request,
      requestState: dto.requestState,
      node: dto.node,
      transaction: dto.transaction,
    });

    // run failed action if any condition failed
    if (!conditionResult && dto.node.conditionFailedActionRunnerId) {
      await this.actionService.runAction({
        actionId: dto.node.conditionFailedActionRunnerId,
        request: dto.request,
        requestState: dto.requestState,
        node: dto.node,
        transaction: dto.transaction,
      });
    }

    if (!conditionResult) return;

    await this.actionService.runOutboundActions({
      node: dto.node,
      request: dto.request,
      requestState: dto.requestState,
      transaction: dto.transaction,
    });

    // traverse based referral
    await this.traverseBasedReferral({
      node: dto.node,
      request: dto.request,
      requestState: dto.requestState,
      transaction: dto.transaction,
      users: dto.users,
    });

    // remove current state
    await this.requestStateRepository.destroy({
      where: {
        requestId: dto.request.id,
        id: dto.requestState.id,
      },
      transaction: dto.transaction,
    });
  }

  private async traverseBasedReferral(dto: TraverseBasedReferralDto) {
    const traverseStrategies = {
      [ReferralTypeEnum.Direct]: () =>
        this.traverseBasedDirectUser({
          node: dto.node,
          requestState: dto.requestState,
          request: dto.request,
          transaction: dto.transaction,
          users: dto.users,
        }),
      [ReferralTypeEnum.Role]: () =>
        this.traverseBasedRole({
          node: dto.node,
          request: dto.request,
          requestState: dto.requestState,
          transaction: dto.transaction,
        }),
    };

    const strategy = traverseStrategies[dto.node.referralTypeId];
    if (!strategy)
      throw new BadRequestException(
        this.i18n.translate('bpmn.unknown_referral_type', {
          lang: I18nContext.current().lang,
        }),
      );
    await strategy();
  }

  private async traverseBasedDirectUser(dto: TraverseBasedDirectUserDto) {
    const nodeProvidedUsers: UserTraverseDto[] = [];
    if (dto.node.userId) {
      nodeProvidedUsers.push({ userId: dto.node.userId });
    }
    const users = dto.users ?? nodeProvidedUsers;

    // if doesn't find any user for traverse
    if (users.length === 0) {
      throw new BadRequestException(
        this.i18n.translate('bpmn.cannot_find_any_referral_user', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    // traverse to find it users
    for (const user of users) {
      const newRequestState = await this.requestStateRepository.create(
        {
          requestId: dto.request.id,
          activityId: dto.node.toActivityId,
          userId: user.userId,
          returnRequestStateId: dto.requestState.returnRequestStateId,
        },
        { transaction: dto.transaction },
      );

      // set histories

      await this.newStateReached({
        request: dto.request,
        newRequestState: newRequestState,
        node: dto.node,
        transaction: dto.transaction,
      });
    }
  }

  private async traverseBasedRole(dto: TraverseBasedRoleDto) {
    if (dto.node.roleId == null) {
      throw new BadRequestException(
        this.i18n.translate('bpmn.node_has_not_assigned_any_roles', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    if (dto.users != null && dto.users.length > 0) {
      let userRoles = await this.userRoleRepository.findAll(
        new QueryOptionsBuilder().filter({ roleId: dto.node.roleId }).build(),
      );
      userRoles = userRoles.filter((userRole) =>
        dto.users.some((user) => user.userId === userRole.userId),
      );

      // cannot find any users
      if (userRoles.length === 0) {
        throw new BadRequestException(
          this.i18n.translate('bpmn.cannot_find_any_referral_user', {
            lang: I18nContext.current().lang,
          }),
        );
      }

      // iterate between users
      for (const userRole of userRoles) {
        const newRequestState = await this.requestStateRepository.create(
          {
            requestId: dto.request.id,
            activityId: dto.node.toActivityId,
            userId: userRole.userId,
            returnRequestStateId: dto.requestState.returnRequestStateId,
          },
          { transaction: dto.transaction },
        );

        // set histories

        await this.newStateReached({
          request: dto.request,
          newRequestState: newRequestState,
          node: dto.node,
          transaction: dto.transaction,
        });
      }
    } else {
      const newRequestState = await this.requestStateRepository.create(
        {
          requestId: dto.request.id,
          activityId: dto.node.toActivityId,
          roleId: dto.node.roleId,
          returnRequestStateId: dto.requestState.returnRequestStateId,
        },
        { transaction: dto.transaction },
      );

      // set histories
      await this.newStateReached({
        request: dto.request,
        newRequestState: newRequestState,
        node: dto.node,
        transaction: dto.transaction,
      });
    }
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
  // if new state touched
  private async newStateReached(dto: NewStateReachedDto) {
    // run inbound action
    await this.actionService.runInboundActions({
      node: dto.node,
      request: dto.request,
      requestState: dto.newRequestState,
      transaction: dto.transaction,
    });

    if (
      dto.node.toActivity.activityTypeId == ActivityTypeEnum.SubProcessState
    ) {
      if (dto.node.toActivity.insideProcessRunnerId == null) {
        throw new BadRequestException(
          await this.i18n.translate('bpmn.undefined_inside_process_runner_id', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      const subProcessState = await this.requestStateService.initRequestState({
        processId: dto.node.toActivity.insideProcessRunnerId,
        request: dto.request,
        returnRequestStateId: dto.newRequestState.id,
        transaction: dto.transaction,
      });
      await this.autoTraverse({
        request: dto.request,
        requestState: subProcessState,
        transaction: dto.transaction,
      });
    } else if (
      dto.node.toActivity.isEndActivity &&
      dto.node.toActivity.processId != dto.request.processId
    ) {
      const returnRequestStateId = dto.newRequestState.returnRequestStateId;
      if (returnRequestStateId == null) {
        throw new BadRequestException('return requestStateId is null');
      }
      const parentRequestState = await this.requestStateRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: returnRequestStateId })
          .filter({ requestId: dto.request.id })
          .transaction(dto.transaction)
          .build(),
      );
      if (!parentRequestState) {
        throw new BadRequestException('parent request state not founded !!!');
      }
      // remove last activity of sub process activity
      await this.requestStateRepository.destroy({
        where: {
          id: dto.newRequestState.id,
          requestId: dto.request.id,
        },
        transaction: dto.transaction,
      });

      await this.autoTraverse({
        request: dto.request,
        requestState: parentRequestState,
        transaction: dto.transaction,
      });
    } else {
      await this.autoTraverse({
        request: dto.request,
        requestState: dto.newRequestState,
        transaction: dto.transaction,
      });
    }
  }
}

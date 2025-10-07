import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNNode,
  BPMNNodeCommand,
  BPMNNodeCommandType,
  BPMNOrganizationUser,
  BPMNPROCESS,
  BPMNRequestHistory,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { UserRole } from '@rahino/database';
import {
  AutoTraverseDto,
  NewStateReachedDto,
  TraverseBasedDirectUserDto,
  TraverseBasedReferralDto,
  TraverseBasedRoleDto,
  TraverseBasedSameOrganizationRoleDto,
  TraverseBaseRequestOwnerDto,
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
import { v4 as uuidv4 } from 'uuid';
import { HistoryService } from '../history';
import { ReverseDto } from './dto/reverse.dto';
import { NodeService } from '../node';

@Injectable()
export class TraverseService {
  constructor(
    @InjectModel(BPMNNode)
    private readonly nodeRepository: typeof BPMNNode,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    @InjectModel(BPMNRequestHistory)
    private readonly requestHistoryRepository: typeof BPMNRequestHistory,
    private readonly requestStateService: RequestStateService,
    private readonly conditionService: ConditionService,
    private readonly actionService: ActionService,
    private readonly historyService: HistoryService,
    private readonly nodeService: NodeService,
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

    if (dto.executeBundle == null) {
      dto.executeBundle = uuidv4();
    }

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
      userExecuterId: dto.userExecuterId,
    });

    // traverse based referral
    await this.traverseBasedReferral({
      node: dto.node,
      nodeCommand: dto.nodeCommand,
      request: dto.request,
      requestState: dto.requestState,
      transaction: dto.transaction,
      users: dto.users,
      userExecuterId: dto.userExecuterId,
      executeBundle: dto.executeBundle,
      description: dto.description,
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

  async autoTraverse(dto: AutoTraverseDto) {
    // find all nextAutoNode with submit nodeCommandType
    const nextAutoNodes = await this.findNextAutoNodes(dto);

    for (const nextAutoNode of nextAutoNodes) {
      for (const nodeCommand of nextAutoNode.nodeCommands) {
        await this.traverse({
          request: dto.request,
          requestState: dto.requestState,
          node: nextAutoNode,
          nodeCommand: nodeCommand,
          description: dto.description,
          transaction: dto.transaction,
          executeBundle: dto.executeBundle,
        });
      }
    }
  }

  private async findNextAutoNodes(dto: AutoTraverseDto) {
    return await this.nodeRepository.findAll(
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
  }

  private async traverseBasedReferral(dto: TraverseBasedReferralDto) {
    const traverseStrategies = {
      [ReferralTypeEnum.Direct]: () =>
        this.traverseBasedDirectUser({
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          requestState: dto.requestState,
          request: dto.request,
          transaction: dto.transaction,
          userExecuterId: dto.userExecuterId,
          executeBundle: dto.executeBundle,
          users: dto.users,
          description: dto.description,
        }),
      [ReferralTypeEnum.Role]: () =>
        this.traverseBasedRole({
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          request: dto.request,
          requestState: dto.requestState,
          transaction: dto.transaction,
          users: dto.users,
          executeBundle: dto.executeBundle,
          userExecuterId: dto.userExecuterId,
          description: dto.description,
        }),

      [ReferralTypeEnum.SameOrganizationRole]: () =>
        this.traverseBasedSameOrganizationRole({
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          request: dto.request,
          requestState: dto.requestState,
          transaction: dto.transaction,
          users: dto.users,
          executeBundle: dto.executeBundle,
          userExecuterId: dto.userExecuterId,
          description: dto.description,
        }),

      [ReferralTypeEnum.RequestOwner]: () =>
        this.traverseBasedRequestOwner({
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          requestState: dto.requestState,
          request: dto.request,
          transaction: dto.transaction,
          userExecuterId: dto.userExecuterId,
          executeBundle: dto.executeBundle,
          description: dto.description,
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
        oldRequestState: dto.requestState,
        newRequestState: newRequestState,
        node: dto.node,
        nodeCommand: dto.nodeCommand,
        transaction: dto.transaction,
        description: dto.description,
        executeBundle: dto.executeBundle,
        userExecuterId: dto.userExecuterId,
      });
    }
  }

  private async traverseBasedRequestOwner(dto: TraverseBaseRequestOwnerDto) {
    // traverse to ownerRequest
    const newRequestState = await this.requestStateRepository.create(
      {
        requestId: dto.request.id,
        activityId: dto.node.toActivityId,
        userId: dto.request.userId,
        returnRequestStateId: dto.requestState.returnRequestStateId,
      },
      { transaction: dto.transaction },
    );

    // set histories
    await this.newStateReached({
      request: dto.request,
      oldRequestState: dto.requestState,
      newRequestState: newRequestState,
      node: dto.node,
      nodeCommand: dto.nodeCommand,
      transaction: dto.transaction,
      description: dto.description,
      executeBundle: dto.executeBundle,
      userExecuterId: dto.userExecuterId,
    });
  }

  private async traverseBasedRole(dto: TraverseBasedRoleDto) {
    this.validateRoleBasedNode(dto.node);

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
          oldRequestState: dto.requestState,
          newRequestState: newRequestState,
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          transaction: dto.transaction,
          executeBundle: dto.executeBundle,
          userExecuterId: dto.userExecuterId,
          description: dto.description,
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
        oldRequestState: dto.requestState,
        newRequestState: newRequestState,
        node: dto.node,
        nodeCommand: dto.nodeCommand,
        transaction: dto.transaction,
        description: dto.description,
        executeBundle: dto.executeBundle,
        userExecuterId: dto.userExecuterId,
      });
    }
  }

  private async traverseBasedSameOrganizationRole(
    dto: TraverseBasedSameOrganizationRoleDto,
  ) {
    this.validateRoleBasedNode(dto.node);

    if (dto.users != null && dto.users.length > 0) {
      const userIds = dto.users.map((user) => user.userId);

      const bpmnOrganizationUsers =
        await this.organizationUserRepository.findAll(
          new QueryOptionsBuilder()
            .filter({
              userId: {
                [Op.in]: userIds,
              },
            })
            .filter({
              organizationId: dto.request.organizationId,
            })
            .filter({ roleId: dto.node.roleId })
            .build(),
        );

      // cannot find any users
      if (bpmnOrganizationUsers.length === 0) {
        throw new BadRequestException(
          this.i18n.translate('bpmn.cannot_find_any_referral_user', {
            lang: I18nContext.current().lang,
          }),
        );
      }

      // iterate between users
      for (const organizationUser of bpmnOrganizationUsers) {
        const newRequestState = await this.requestStateRepository.create(
          {
            requestId: dto.request.id,
            activityId: dto.node.toActivityId,
            userId: organizationUser.userId,
            returnRequestStateId: dto.requestState.returnRequestStateId,
          },
          { transaction: dto.transaction },
        );

        // set histories

        await this.newStateReached({
          request: dto.request,
          oldRequestState: dto.requestState,
          newRequestState: newRequestState,
          node: dto.node,
          nodeCommand: dto.nodeCommand,
          transaction: dto.transaction,
          executeBundle: dto.executeBundle,
          userExecuterId: dto.userExecuterId,
          description: dto.description,
        });
      }
    } else {
      // direct to all users if users isn't pass
      const newRequestState = await this.requestStateRepository.create(
        {
          requestId: dto.request.id,
          activityId: dto.node.toActivityId,
          organizationId: dto.request.organizationId,
          roleId: dto.node.roleId,
          returnRequestStateId: dto.requestState.returnRequestStateId,
        },
        { transaction: dto.transaction },
      );

      // set histories
      await this.newStateReached({
        request: dto.request,
        oldRequestState: dto.requestState,
        newRequestState: newRequestState,
        node: dto.node,
        nodeCommand: dto.nodeCommand,
        transaction: dto.transaction,
        description: dto.description,
        executeBundle: dto.executeBundle,
        userExecuterId: dto.userExecuterId,
      });
    }
  }

  private validateRoleBasedNode(node: BPMNNode) {
    if (node.roleId == null) {
      throw new BadRequestException(
        this.i18n.translate('bpmn.node_has_not_assigned_any_roles', {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  private async handleTraverseBasedRoleIfUserPass() {}

  // if new state touched
  private async newStateReached(dto: NewStateReachedDto) {
    const {
      node,
      nodeCommand,
      request,
      oldRequestState,
      newRequestState,
      transaction,
      executeBundle,
      userExecuterId,
      description,
    } = dto;

    // Run inbound action
    await this.actionService.runInboundActions({
      node,
      request,
      requestState: newRequestState,
      transaction,
      userExecuterId: userExecuterId,
    });

    // Set histories

    await this.historyService.addHistory({
      executeBundle: executeBundle,
      node: node,
      nodeCommand: nodeCommand,
      oldRequestStaet: oldRequestState,
      request: request,
      requestState: newRequestState,
      transaction: transaction,
      description: description,
      userExecuterId: userExecuterId,
    });

    if (node.toActivity.activityTypeId === ActivityTypeEnum.SubProcessState) {
      await this.handleSubProcessState(dto);
    } else if (
      node.toActivity.isEndActivity &&
      node.toActivity.processId !== request.processId
    ) {
      await this.handleEndActivity(dto);
    } else {
      await this.autoTraverse({
        request,
        requestState: newRequestState,
        transaction,
        userExecuterId,
        executeBundle,
      });
    }
  }

  private async handleSubProcessState(dto: NewStateReachedDto) {
    const {
      node,
      request,
      newRequestState,
      transaction,
      executeBundle,
      userExecuterId,
      oldRequestState,
    } = dto;

    if (node.toActivity.insideProcessRunnerId == null) {
      throw new BadRequestException(
        await this.i18n.translate('bpmn.undefined_inside_process_runner_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const subProcessState = await this.requestStateService.initRequestState({
      processId: node.toActivity.insideProcessRunnerId,
      request,
      returnRequestStateId: newRequestState.id,
      transaction,
    });

    await this.autoTraverse({
      request,
      requestState: subProcessState,
      transaction,
      executeBundle,
      userExecuterId,
    });
  }

  private async handleEndActivity(dto: NewStateReachedDto) {
    const {
      newRequestState,
      request,
      transaction,
      executeBundle,
      userExecuterId,
    } = dto;

    const returnRequestStateId = newRequestState.returnRequestStateId;
    if (returnRequestStateId == null) {
      throw new BadRequestException('return requestStateId is null');
    }

    const parentRequestState = await this.requestStateRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: returnRequestStateId })
        .filter({ requestId: request.id })
        .transaction(transaction)
        .build(),
    );

    if (!parentRequestState) {
      throw new BadRequestException('parent request state not founded !!!');
    }

    // Remove last activity of sub process activity
    await this.requestStateRepository.destroy({
      where: {
        id: newRequestState.id,
        requestId: request.id,
      },
      transaction,
    });

    await this.autoTraverse({
      request,
      requestState: parentRequestState,
      transaction,
      userExecuterId,
      executeBundle,
    });
  }

  public async reverse(dto: ReverseDto) {
    // remove current state
    await this.requestStateRepository.destroy({
      where: {
        requestId: dto.request.id,
      },
      transaction: dto.transaction,
    });

    if (dto.executeBundle == null) {
      dto.executeBundle = uuidv4();
    }

    const findHistoryFromWhichActivity =
      await this.requestHistoryRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ executeBundle: dto.historyBundle })
          .filter({ requestId: dto.request.id })
          .order({ orderBy: 'id', sortOrder: 'asc' })
          .transaction(dto.transaction)
          .build(),
      );

    // init current state

    const newRequestState = await this.requestStateRepository.create(
      {
        requestId: dto.request.id,
        activityId: findHistoryFromWhichActivity.fromActivityId,
        userId: findHistoryFromWhichActivity.fromUserId,
        roleId: findHistoryFromWhichActivity.fromRoleId,
        organizationId: findHistoryFromWhichActivity.fromOrganizationId,
      },
      { transaction: dto.transaction },
    );

    const nodeExecutedFromHistories =
      await this.requestHistoryRepository.findAll(
        new QueryOptionsBuilder()
          .filter({ executeBundle: dto.historyBundle })
          .filter({ requestId: dto.request.id })
          .filter({
            fromActivityId: findHistoryFromWhichActivity.fromActivityId,
          })
          .order({ orderBy: 'id', sortOrder: 'asc' })
          .transaction(dto.transaction)
          .build(),
      );

    for (const nodeExecuted of nodeExecutedFromHistories) {
      const node = await this.nodeService.filterNode({
        id: nodeExecuted.nodeId,
        nodeCommandId: nodeExecuted.nodeCommandId,
      });

      await this.traverse({
        node: node,
        nodeCommand: node.nodeCommands[0],
        request: dto.request,
        executeBundle: dto.executeBundle,
        userExecuterId: dto.userExecuterId,
        users: nodeExecuted.toUserId
          ? [{ userId: nodeExecuted.toUserId }]
          : null,
        requestState: newRequestState,
        transaction: dto.transaction,
      });
    }
  }
}

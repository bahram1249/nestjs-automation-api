import { Injectable } from '@nestjs/common';
import { AddHistoryDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNRequestHistory } from '@rahino/localdatabase/models';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(BPMNRequestHistory)
    private readonly requestHistory: typeof BPMNRequestHistory,
  ) {}

  async addHistory(dto: AddHistoryDto) {
    await this.requestHistory.create(
      {
        requestId: dto.request.id,
        fromRoleId: dto.oldRequestStaet.roleId,
        fromUserId: dto.userExecuterId ?? dto.oldRequestStaet.userId,
        fromOrganizationId: dto.oldRequestStaet.organizationId,
        toRoleId: dto.requestState.roleId,
        toUserId: dto.requestState.userId,
        toOrganizationId: dto.requestState.organizationId,
        fromActivityId: dto.oldRequestStaet.activityId,
        toActivityId: dto.requestState.activityId,
        nodeId: dto.node.id,
        nodeCommandId: dto.nodeCommand.id,
        description: dto.description,
        executeBundle: dto.executeBundle,
      },
      { transaction: dto.transaction },
    );
  }
}

import { BPMNRequestHistory, GSSolution } from '@rahino/localdatabase/models';
import { HistoryOutputDto } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryMapper {
  constructor() {}
  mapItems(items: BPMNRequestHistory[]): HistoryOutputDto[] {
    const outputItems: HistoryOutputDto[] = [];
    for (const item of items) {
      outputItems.push(this.map(item));
    }
    return outputItems;
  }

  map(item: BPMNRequestHistory): HistoryOutputDto {
    const output = new HistoryOutputDto();
    output.id = item.id;
    output.requestId = item.requestId;
    output.createdAt = item.createdAt;
    output.updatedAt = item.updatedAt;
    output.from = this.fromFieldMap(item);
    output.to = this.toFieldMap(item);
    output.nodeCommand = item.nodeCommand.name;
    output.nodeCommandColor = item.nodeCommand.nodeCommandType.commandColor;
    output.description = item.description;
    return output;
  }

  fromFieldMap(item: BPMNRequestHistory) {
    const fromState = item.fromActivity.name;
    const fromUser =
      item.fromUser != null
        ? item.fromUser?.firstname + ' ' + item.fromUser?.lastname
        : null;
    const fromOrganization =
      item.fromOrganization != null ? item.fromOrganization?.name : null;

    const fromRole = item.fromRole != null ? item.fromRole?.roleName : null;
    const symbolArray: string[] = [];
    if (fromUser != null) symbolArray.push(fromUser);
    if (fromRole != null) symbolArray.push(fromRole);
    if (fromOrganization != null) symbolArray.push(fromOrganization);

    return `${fromState} (${symbolArray.join(' - ')})`;
  }

  toFieldMap(item: BPMNRequestHistory) {
    const toState = item.toActivity.name;
    const toUser =
      item.toUser != null
        ? item.toUser?.firstname + ' ' + item.toUser?.lastname
        : null;
    const toOrganization =
      item.toOrganization != null ? item.toOrganization?.name : null;

    const toRole = item.toRole != null ? item.toRole?.roleName : null;
    const symbolArray: string[] = [];
    if (toUser != null) symbolArray.push(toUser);
    if (toRole != null) symbolArray.push(toRole);
    if (toOrganization != null) symbolArray.push(toOrganization);

    return `${toState} (${symbolArray.join(' - ')})`;
  }
}

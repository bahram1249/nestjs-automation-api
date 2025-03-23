import { BadRequestException } from '@nestjs/common';
import { User } from '@rahino/database';
import { CartableService } from '@rahino/guarantee/admin/cartable';
import { GetCartableDto } from '@rahino/guarantee/admin/cartable/dto';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { LocalizationService } from 'apps/main/src/common/localization';
import * as _ from 'lodash';
import { ValidateAndReturnCartableItemDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

export class GuaranteeTraverseService {
  constructor(
    private readonly cartableService: CartableService,
    private readonly listFilterV2Factory: ListFilterV2Factory,
    private readonly localizationService: LocalizationService,
    @InjectModel(BPMNRequest)
    private readonly requestRepository: typeof BPMNRequest,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    @InjectModel(BPMNNode)
    private readonly nodeRepository: typeof BPMNNode,
    @InjectModel(BPMNNodeCommand)
    private readonly nodeCommandRepository: typeof BPMNNodeCommand,
  ) {}

  async validateAndReturnCartableItem(
    user: User,
    dto: GuaranteeTraverseDto,
  ): Promise<ValidateAndReturnCartableItemDto> {
    const emptyFilter = await this.listFilterV2Factory.create();
    const filter = emptyFilter as GetCartableDto;
    filter.requestId = dto.requestId;
    filter.requestStateId = dto.requestStateId;
    const findItems = await this.cartableService.findAll(user, filter);
    const items = findItems.result;
    if (items.length == 0)
      throw new BadRequestException(
        this.localizationService.translate('core.not_found'),
      );

    const cartableItem = items[0];
    let node = cartableItem.nodes.find((item) => item.id == dto.nodeId);
    if (!node) throw new BadRequestException('invalid nodeId');

    let nodeCommand = node.nodeCommands.find(
      (command) => command.id == dto.nodeCommandId,
    );
    if (!nodeCommand) {
      throw new BadRequestException('invalid node command');
    }
    const requestState = await this.requestStateRepository.findOne(
      new QueryOptionsBuilder().filter({ id: cartableItem.id }).build(),
    );
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder().filter({ id: cartableItem.requestId }).build(),
    );
    node = await this.nodeRepository.findOne(
      new QueryOptionsBuilder().filter({ id: node.id }).build(),
    );
    nodeCommand = await this.nodeCommandRepository.findOne(
      new QueryOptionsBuilder().filter({ id: nodeCommand.id }).build(),
    );

    return {
      node: node,
      nodeCommand: nodeCommand,
      requestState: requestState,
      request: request,
    };
  }
}

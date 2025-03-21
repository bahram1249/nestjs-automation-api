import { BadRequestException } from '@nestjs/common';
import { User } from '@rahino/database';
import { CartableService } from '@rahino/guarantee/admin/cartable';
import { GetCartableDto } from '@rahino/guarantee/admin/cartable/dto';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { LocalizationService } from 'apps/main/src/common/localization';
import * as _ from 'lodash';

export class GuaranteeTraverseService {
  constructor(
    private readonly cartableService: CartableService,
    private readonly listFilterV2Factory: ListFilterV2Factory,
    private readonly localizationService: LocalizationService,
  ) {}

  async validate(user: User, dto: GuaranteeTraverseDto) {
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
    const node = cartableItem.nodes.find((item) => item.id == dto.nodeId);
    if (!node) throw new BadRequestException('invalid nodeId');

    const nodeCommand = node.nodeCommands.find(
      (command) => command.id == dto.nodeCommandId,
    );
    if (!nodeCommand) {
      throw new BadRequestException('invalid node command');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNPROCESS } from '@rahino/localdatabase/models';
import { GetProcessDto, CreateProcessDto, UpdateProcessDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(BPMNPROCESS)
    private readonly repository: typeof BPMNPROCESS,
  ) {}

  async findAll(filter: GetProcessDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNPROCESS.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'name', 'isSubProcess', 'staticId'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async lookup(filter: GetProcessDto) {
    // Count with base filters (no pagination)
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNPROCESS.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      });
    const total = await this.repository.count(qbBase.build());

    // List with attributes and pagination
    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNPROCESS.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .attributes(['id', 'name'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qbList.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'isSubProcess', 'staticId'])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNPROCESS.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.process_not_found');
    return { result: item };
  }

  async create(dto: CreateProcessDto) {
    // optional: ensure unique name or staticId
    if (dto.staticId) {
      const exists = await this.repository.findOne(
        new QueryOptionsBuilder().filter({ staticId: dto.staticId }).build(),
      );
      if (exists)
        throw new BadRequestException('bpmn.process_static_id_exists');
    }
    const created = await this.repository.create({ ...dto });
    return { result: created };
  }

  async update(id: number, dto: UpdateProcessDto) {
    const item = await this.repository.findByPk(id);
    if (!item || (item as any).isDeleted === true) {
      throw new NotFoundException('bpmn.process_not_found');
    }
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item || item.isDeleted === true) {
      throw new NotFoundException('bpmn.process_not_found');
    }
    await item.update({ isDeleted: true });
    return { ok: true };
  }
}

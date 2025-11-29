import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNPROCESS,
  BPMNActivity,
  BPMNNode,
  BPMNInboundAction,
  BPMNOutboundAction,
  BPMNNodeCondition,
  BPMNNodeCommand,
  BPMNAction,
  BPMNCondition,
  BPMNNodeCommandType,
} from '@rahino/localdatabase/models';
import { GetProcessDto, CreateProcessDto, UpdateProcessDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(BPMNPROCESS)
    private readonly repository: typeof BPMNPROCESS,
    @InjectModel(BPMNActivity)
    private readonly activityRepo: typeof BPMNActivity,
    @InjectModel(BPMNNode)
    private readonly nodeRepo: typeof BPMNNode,
    @InjectModel(BPMNInboundAction)
    private readonly inboundRepo: typeof BPMNInboundAction,
    @InjectModel(BPMNOutboundAction)
    private readonly outboundRepo: typeof BPMNOutboundAction,
    @InjectModel(BPMNNodeCondition)
    private readonly nodeConditionRepo: typeof BPMNNodeCondition,
    @InjectModel(BPMNNodeCommand)
    private readonly nodeCommandRepo: typeof BPMNNodeCommand,
    @InjectModel(BPMNAction)
    private readonly actionRepo: typeof BPMNAction,
    @InjectModel(BPMNCondition)
    private readonly conditionRepo: typeof BPMNCondition,
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

  async graph(
    processId: number,
    opts?: {
      inbound?: boolean;
      outbound?: boolean;
      nodeConditions?: boolean;
      nodeCommands?: boolean;
    },
  ) {
    // verify process exists
    const proc = await this.repository.findByPk(processId);
    if (!proc || (proc as any).isDeleted === true) {
      throw new NotFoundException('bpmn.process_not_found');
    }

    // fetch activities in process
    const activities = await this.activityRepo.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'isStartActivity', 'isEndActivity'])
        .filter({ processId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNActivity.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .order({ orderBy: 'id', sortOrder: 'ASC' })
        .build(),
    );

    const activityIds = activities.map((a) => a.id);

    if (activityIds.length === 0) {
      return {
        result: {
          activities: [],
          edges: [],
          inbound: [],
          outbound: [],
          nodeConditions: [],
          nodeCommands: [],
        },
      };
    }

    // fetch edges (nodes) connecting activities within this process
    const edges = await this.nodeRepo.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'fromActivityId', 'toActivityId', 'name'])
        .filter({ fromActivityId: { [Op.in]: activityIds } as any })
        .filter({ toActivityId: { [Op.in]: activityIds } as any })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNNode.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .order({ orderBy: 'id', sortOrder: 'ASC' })
        .build(),
    );

    const nodeIds = edges.map((e) => e.id);

    // Optional expansions
    let inbound: any[] = [];
    let outbound: any[] = [];
    let nodeConditions: any[] = [];
    let nodeCommands: any[] = [];

    if (opts?.inbound) {
      inbound = await this.inboundRepo.findAll(
        new QueryOptionsBuilder()
          .attributes(['id', 'activityId', 'priority'])
          .filter({ activityId: { [Op.in]: activityIds } as any })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('BPMNInboundAction.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .include([
            {
              model: this.actionRepo,
              as: 'action',
              attributes: ['id', 'name'],
              required: false,
            },
          ])
          .order({ orderBy: 'id', sortOrder: 'ASC' })
          .build(),
      );
      inbound = inbound.map((ia: any) => ({
        id: ia.id,
        activityId: ia.activityId,
        priority: ia.priority ?? null,
        actionId: ia.actionId,
        actionName: ia.action?.name,
      }));
    }

    if (opts?.outbound) {
      outbound = await this.outboundRepo.findAll(
        new QueryOptionsBuilder()
          .attributes(['id', 'activityId', 'priority'])
          .filter({ activityId: { [Op.in]: activityIds } as any })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('BPMNOutboundAction.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .include([
            {
              model: this.actionRepo,
              as: 'action',
              attributes: ['id', 'name'],
              required: false,
            },
          ])
          .order({ orderBy: 'id', sortOrder: 'ASC' })
          .build(),
      );
      outbound = outbound.map((oa: any) => ({
        id: oa.id,
        activityId: oa.activityId,
        priority: oa.priority ?? null,
        actionId: oa.actionId,
        actionName: oa.action?.name,
      }));
    }

    if (opts?.nodeConditions && nodeIds.length > 0) {
      nodeConditions = await this.nodeConditionRepo.findAll(
        new QueryOptionsBuilder()
          .attributes(['nodeId', 'conditionId', 'priority'])
          .filter({ nodeId: { [Op.in]: nodeIds } as any })
          .include([
            {
              model: this.conditionRepo,
              as: 'condition',
              attributes: ['id', 'name'],
              required: false,
            },
          ])
          .order({ orderBy: 'priority', sortOrder: 'ASC' })
          .build(),
      );
      nodeConditions = nodeConditions.map((nc: any) => ({
        nodeId: nc.nodeId,
        conditionId: nc.conditionId,
        priority: nc.priority ?? null,
        conditionName: nc.condition?.name,
      }));
    }

    if (opts?.nodeCommands && nodeIds.length > 0) {
      nodeCommands = await this.nodeCommandRepo.findAll(
        new QueryOptionsBuilder()
          .attributes(['id', 'nodeId', 'name', 'route', 'nodeCommandTypeId'])
          .filter({ nodeId: { [Op.in]: nodeIds } as any })
          .include([
            {
              model: BPMNNodeCommandType,
              as: 'nodeCommandType',
              attributes: ['id', 'name', 'commandColor'],
              required: false,
            },
          ])
          .order({ orderBy: 'id', sortOrder: 'ASC' })
          .build(),
      );
      nodeCommands = nodeCommands.map((nc: any) => ({
        id: nc.id,
        nodeId: nc.nodeId,
        name: nc.name,
        route: nc.route ?? null,
        nodeCommandTypeId: nc.nodeCommandTypeId,
        nodeCommandTypeName: nc.nodeCommandType?.name,
        nodeCommandTypeColor: nc.nodeCommandType?.commandColor,
      }));
    }

    return {
      result: {
        activities: activities.map((a) => ({
          id: a.id,
          name: a.name,
          isStartActivity: (a as any).isStartActivity,
          isEndActivity: (a as any).isEndActivity,
        })),
        edges: edges.map((e) => ({
          id: e.id,
          fromActivityId: e.fromActivityId,
          toActivityId: e.toActivityId,
          name: (e as any).name ?? undefined,
        })),
        inbound,
        outbound,
        nodeConditions,
        nodeCommands,
      },
    };
  }
}

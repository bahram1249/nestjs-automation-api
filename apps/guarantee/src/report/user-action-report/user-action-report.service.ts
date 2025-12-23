import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import {
  BPMNRequest,
  BPMNRequestHistory,
  BPMNNode,
  BPMNActivity,
} from '@rahino/localdatabase/models/bpmn';
import { User } from '@rahino/database';
import { GetUserActionReportDto } from './dto/user-action-report.dto';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ActivityTypeEnum } from '@rahino/bpmn/modules/activity-type';

@Injectable()
export class UserActionReportService {
  constructor(
    @InjectModel(BPMNRequestHistory)
    private readonly requestHistoryRepository: typeof BPMNRequestHistory,
  ) {}

  private _buildQuery(dto: GetUserActionReportDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        createdAt: {
          [Op.between]: [dto.startDate, dto.endDate],
        },
      })
      .filter({
        '$fromActivity.activityTypeId$': {
          [Op.ne]: ActivityTypeEnum.ClientState,
        },
      })
      .filterIf(dto.organizationId != null, {
        '$request.organizationId$': dto.organizationId,
      })
      .include([
        {
          attributes: [],
          model: BPMNRequest,
          as: 'request',
          required: true,
        },
        {
          attributes: [],
          model: BPMNNode,
          as: 'node',
          where: {
            autoIterate: false,
          },
          required: true,
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['firstname', 'lastname'],
        },
        {
          model: BPMNActivity,
          as: 'fromActivity',
          attributes: ['name'],
        },
        {
          model: BPMNActivity,
          as: 'toActivity',
          attributes: ['name'],
        },
      ])
      .attributes([
        'BPMNRequestHistory.fromUserId',
        'BPMNRequestHistory.fromActivityId',
        'BPMNRequestHistory.toActivityId',
        'BPMNRequestHistory.nodeId',
        [
          Sequelize.fn('COUNT', Sequelize.col('BPMNRequestHistory.id')),
          'count',
        ],
        [
          Sequelize.fn(
            'STRING_AGG',
            Sequelize.col('BPMNRequestHistory.requestId'),
            ',',
          ),
          'requestIds',
        ],
      ])
      .group([
        'BPMNRequestHistory.fromUserId',
        'BPMNRequestHistory.fromActivityId',
        'BPMNRequestHistory.toActivityId',
        'BPMNRequestHistory.nodeId',
        'fromUser.id',
        'fromUser.firstname',
        'fromUser.lastname',
        'fromActivity.id',
        'fromActivity.name',
        'toActivity.id',
        'toActivity.name',
      ]);

    return queryBuilder;
  }

  async findAll(dto: GetUserActionReportDto) {
    const queryBuilder = this._buildQuery(dto);
    const results = await this.requestHistoryRepository.findAll(
      queryBuilder.build(),
    );
    return results.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        ...plainItem,
        requestIds: plainItem.requestIds
          ? plainItem.requestIds.split(',').map((id) => parseInt(id, 10))
          : [],
      };
    });
  }

  async exportExcel(dto: GetUserActionReportDto): Promise<Buffer> {
    const rows = await this.findAll(dto);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('UserActionReports');
    sheet.columns = [
      { header: 'کاربر', key: 'user', width: 25 },
      { header: 'از فعالیت', key: 'fromActivity', width: 25 },
      { header: 'به فعالیت', key: 'toActivity', width: 25 },
      { header: 'تعداد', key: 'count', width: 10 },
      { header: 'شناسه درخواست ها', key: 'requestIds', width: 50 },
    ];

    for (const row of rows) {
      sheet.addRow({
        user: row.fromUser.firstname + ' ' + row.fromUser.lastname,
        fromActivity: row.fromActivity.name,
        toActivity: row.toActivity.name,
        count: row.count,
        requestIds: row.requestIds.join(', '),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}

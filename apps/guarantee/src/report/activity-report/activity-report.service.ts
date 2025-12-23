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
import { GetActivityReportDto } from './dto/get-activity-report.dto';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ActivityTypeEnum } from '@rahino/bpmn/modules/activity-type';

@Injectable()
export class ActivityReportService {
  constructor(
    @InjectModel(BPMNRequestHistory)
    private readonly requestHistoryRepository: typeof BPMNRequestHistory,
  ) {}

  private _buildQuery(dto: GetActivityReportDto) {
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
          model: BPMNActivity,
          as: 'fromActivity',
          attributes: [],
        },
        {
          model: BPMNActivity,
          as: 'toActivity',
          attributes: ['name'],
        },
      ])
      .attributes([
        'BPMNRequestHistory.toActivityId',
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
        'BPMNRequestHistory.toActivityId',
        'toActivity.id',
        'toActivity.name',
      ]);
    return queryBuilder;
  }

  async findAll(dto: GetActivityReportDto) {
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

  async exportExcel(dto: GetActivityReportDto): Promise<Buffer> {
    const rows = await this.findAll(dto);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('ActivityReports');
    sheet.columns = [
      { header: 'به فعالیت', key: 'toActivity', width: 25 },
      { header: 'تعداد', key: 'count', width: 10 },
      { header: 'شناسه درخواست ها', key: 'requestIds', width: 50 },
    ];

    for (const row of rows) {
      sheet.addRow({
        toActivity: row.toActivity.name,
        count: row.count,
        requestIds: row.requestIds.join(', '),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}

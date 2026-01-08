import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import {
  GSRewardHistory,
  GSRewardRule,
  GSGuarantee,
  GSUnitPrice,
} from '@rahino/localdatabase/models/guarantee';
import { User } from '@rahino/database';
import { GetRewardHistoryReportDto } from './dto/reward-history-report.dto';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class RewardHistoryReportService {
  constructor(
    @InjectModel(GSRewardHistory)
    private readonly rewardHistoryRepository: typeof GSRewardHistory,
  ) {}

  private _buildQuery(dto: GetRewardHistoryReportDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        rewardDate: {
          [Op.between]: [dto.startDate, dto.endDate],
        },
      })
      .filterIf(dto.originalGuaranteeSerialNumber != null, {
        originalGuaranteeSerialNumber: {
          [Op.like]: `%${dto.originalGuaranteeSerialNumber}%`,
        },
      })
      .filterIf(dto.userFullName != null, {
        '$user.firstname$': {
          [Op.or]: [{ [Op.like]: `%${dto.userFullName}%` }],
        },
      })
      .include([
        {
          model: GSRewardRule,
          as: 'rewardRule',
          attributes: ['id', 'title', 'rewardAmount'],
          required: true,
        },
        {
          model: User,
          as: 'user',
          attributes: ['firstname', 'lastname', 'username', 'email'],
          required: true,
        },
        {
          model: GSGuarantee,
          as: 'guarantee',
          attributes: ['id', 'serialNumber'],
          required: true,
        },
        {
          model: GSGuarantee,
          as: 'rewardGuarantee',
          attributes: ['id', 'serialNumber', 'startDate', 'endDate'],
          required: true,
        },
        {
          model: GSUnitPrice,
          as: 'unitPrice',
          attributes: ['id', 'title'],
          required: true,
        },
      ])
      .attributes([
        'id',
        'guaranteeId',
        'rewardRuleId',
        'rewardGuaranteeId',
        'unitPriceId',
        'originalGuaranteeSerialNumber',
        'rewardAmount',
        'rewardDate',
      ]);

    return queryBuilder;
  }

  async findAll(dto: GetRewardHistoryReportDto) {
    const queryBuilder = this._buildQuery(dto);
    const results = await this.rewardHistoryRepository.findAll(
      queryBuilder.build(),
    );
    return results;
  }

  async exportExcel(dto: GetRewardHistoryReportDto): Promise<Buffer> {
    const rows = await this.findAll(dto);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('RewardHistoryReports');
    sheet.columns = [
      { header: 'شناسه', key: 'id', width: 15 },
      { header: 'قانون پاداش', key: 'rewardRuleTitle', width: 25 },
      { header: 'مقدار پاداش', key: 'rewardAmount', width: 15 },
      { header: 'واحد پاداش', key: 'unitPriceTitle', width: 20 },
      { header: 'کد کاربری', key: 'userCode', width: 15 },
      { header: 'نام کامل', key: 'userFullName', width: 20 },
      { header: 'شناسه گارانتی اصلی', key: 'guaranteeId', width: 15 },
      {
        header: 'سریال گارانتی اصلی',
        key: 'originalGuaranteeSerialNumber',
        width: 20,
      },
      { header: 'شناسه گارانتی پاداش', key: 'rewardGuaranteeId', width: 15 },
      {
        header: 'سریال گارانتی پاداش',
        key: 'rewardGuaranteeSerialNumber',
        width: 20,
      },
      { header: 'تاریخ پاداش', key: 'rewardDate', width: 20 },
    ];

    for (const row of rows) {
      sheet.addRow({
        id: row.id,
        rewardRuleTitle: row.rewardRule?.title || '',
        rewardAmount: row.rewardAmount || 0,
        unitPriceTitle: row.unitPrice?.title || '',
        userCode: row.user?.username || '',
        userFullName:
          `${row.user?.firstname || ''} ${row.user?.lastname || ''}`.trim(),
        guaranteeId: row.guaranteeId || 0,
        originalGuaranteeSerialNumber: row.originalGuaranteeSerialNumber || '',
        rewardGuaranteeId: row.rewardGuaranteeId || 0,
        rewardGuaranteeSerialNumber: row.rewardGuarantee?.serialNumber || '',
        rewardDate: row.rewardDate,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}

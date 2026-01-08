import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import {
  GSDiscountCodeUsage,
  GSDiscountCode,
  GSFactor,
} from '@rahino/localdatabase/models/guarantee';
import { User } from '@rahino/database';
import { GetDiscountCodeUsageReportDto } from './dto/discount-code-usage-report.dto';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class DiscountCodeUsageReportService {
  constructor(
    @InjectModel(GSDiscountCodeUsage)
    private readonly discountCodeUsageRepository: typeof GSDiscountCodeUsage,
  ) {}

  private _buildQuery(dto: GetDiscountCodeUsageReportDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        usedAt: {
          [Op.between]: [dto.startDate, dto.endDate],
        },
      })
      .filterIf(dto.discountCode != null, {
        '$discountCode.code$': {
          [Op.like]: `%${dto.discountCode}%`,
        },
      })
      .filterIf(dto.userFullName != null, {
        '$user.firstname$': {
          [Op.or]: [{ [Op.like]: `%${dto.userFullName}%` }],
        },
      })
      .include([
        {
          model: GSDiscountCode,
          as: 'discountCode',
          attributes: ['code', 'title', 'discountValue', 'maxDiscountAmount'],
          required: true,
        },
        {
          model: User,
          as: 'user',
          attributes: ['firstname', 'lastname', 'username', 'email'],
          required: true,
        },
        {
          model: GSFactor,
          as: 'factor',
          attributes: ['id', 'totalPrice', 'expireDate'],
          required: true,
        },
      ])
      .attributes([
        'id',
        'discountCodeId',
        'userId',
        'factorId',
        'discountAmount',
        'maxDiscountAmount',
        'usedAt',
      ]);

    return queryBuilder;
  }

  async findAll(dto: GetDiscountCodeUsageReportDto) {
    const queryBuilder = this._buildQuery(dto);
    const count = await this.discountCodeUsageRepository.count(
      queryBuilder.attributes([]).build(),
    );
    const data = await this.discountCodeUsageRepository.findAll(
      queryBuilder.offset(dto.offset).limit(dto.limit).build(),
    );
    return {
      result: data,
      total: count,
    };
  }

  async exportExcel(dto: GetDiscountCodeUsageReportDto): Promise<Buffer> {
    dto.limit = 100000;
    const data = await this.findAll(dto);
    const rows = data.result;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('DiscountCodeUsageReports');
    sheet.columns = [
      { header: 'شناسه استفاده', key: 'id', width: 15 },
      { header: 'کد تخفیف', key: 'discountCode', width: 20 },
      { header: 'عنوان تخفیف', key: 'discountCodeTitle', width: 25 },
      { header: 'مقدار تخفیف', key: 'discountValue', width: 15 },
      { header: 'حداکثر مبلغ تخفیف', key: 'maxDiscountAmount', width: 20 },
      { header: 'کد مشتری', key: 'userCode', width: 15 },
      { header: 'نام کامل', key: 'userFullName', width: 20 },
      { header: 'شناسه فاکتور', key: 'factorId', width: 15 },
      { header: 'مبلغ فاکتور', key: 'factorTotalPrice', width: 15 },
      { header: 'تاریخ استفاده', key: 'usedAt', width: 20 },
    ];

    for (const row of rows) {
      sheet.addRow({
        id: row.id,
        discountCode: row.discountCode?.code || '',
        discountCodeTitle: row.discountCode?.title || '',
        discountValue: row.discountCode?.discountValue || 0,
        maxDiscountAmount: row.discountCode?.maxDiscountAmount || 0,
        userCode: row.user?.username || '',
        userFullName:
          `${row.user?.firstname || ''} ${row.user?.lastname || ''}`.trim(),
        factorId: row.factor?.id || 0,
        factorTotalPrice: row.factor?.totalPrice || 0,
        usedAt: row.usedAt,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}

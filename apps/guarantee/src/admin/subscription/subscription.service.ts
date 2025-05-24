import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSubscriptionDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSSubscription } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment-jalaali';
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(GSSubscription)
    private readonly repository: typeof GSSubscription,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetSubscriptionDto) {
    let query = new QueryOptionsBuilder().filter({
      phoneNumber: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'phoneNumber', 'createdAt', 'updatedAt'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'phoneNumber', 'createdAt', 'updatedAt'])
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }

  async downloadExcel(res: Response) {
    const subscriptions = await this.repository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'phoneNumber', 'createdAt', 'updatedAt'])
        .build(),
    );

    const mappedItems = subscriptions.map((subscription) => ({
      id: subscription.id,
      phoneNumber: subscription.phoneNumber,
      createdAt: moment(subscription.createdAt)
        .tz('Asia/Tehran', false)
        .locale('fa')
        .format('jYYYY-jMM-jDD HH:mm:ss'),
    }));
    const headers: {
      key: string;
      header: string;
    }[] = [
      { key: 'id', header: 'شناسه سیستمی' },
      { key: 'phoneNumber', header: 'شماره تماس' },
      { key: 'createdAt', header: 'تاریخ ثبت نام' },
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add headers with custom names
    worksheet.columns = headers;

    // Add data rows
    mappedItems.forEach((item) => {
      worksheet.addRow(item);
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=subscription-${Date.now()}.xlsx`,
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  }
}

import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/sequelize';
import { GSIrangsImportData } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data.entity';
import * as xlsx from 'xlsx';
import * as persianDate from 'persian-date';
import { GSGuarantee } from '@rahino/localdatabase/models/guarantee/gs-guarantee.entity';
import { GSBrand } from '@rahino/localdatabase/models/guarantee/gs-brand.entity';
import { GSProductType } from '@rahino/localdatabase/models/guarantee/gs-product-type.entity';
import { GSVariant } from '@rahino/localdatabase/models/guarantee/gs-varaint.entity';
import { GSGuaranteePeriod } from '@rahino/localdatabase/models/guarantee/gs-guarantee-period.entity';
import { Op } from 'sequelize';
import { IRANGS_IMPORT_QUEUE } from './constants';
import * as fs from 'fs';
import { GSIrangsImportDataGuarantees } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data-guarantees.entity';
import { IrangsImportStatusEnum } from './enum';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { GSProviderEnum } from '@rahino/guarantee/shared/provider';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';

@Processor(IRANGS_IMPORT_QUEUE)
export class IrangsImportDataProcessor extends WorkerHost {
  constructor(
    @InjectModel(GSIrangsImportData)
    private readonly irangsImportDataRepository: typeof GSIrangsImportData,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    @InjectModel(GSBrand)
    private readonly brandRepository: typeof GSBrand,
    @InjectModel(GSProductType)
    private readonly productTypeRepository: typeof GSProductType,
    @InjectModel(GSVariant)
    private readonly variantRepository: typeof GSVariant,
    @InjectModel(GSGuaranteePeriod)
    private readonly guaranteePeriodRepository: typeof GSGuaranteePeriod,
    @InjectModel(GSIrangsImportDataGuarantees)
    private readonly irangsImportDataGuaranteesRepository: typeof GSIrangsImportDataGuarantees,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { irangsImportDataId, filePath } = job.data;
    const irangsImportData =
      await this.irangsImportDataRepository.findByPk(irangsImportDataId);

    if (!irangsImportData) {
      return;
    }

    await this.updateImportStatus(
      irangsImportDataId,
      IrangsImportStatusEnum.PROCESSING,
    );

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      await this.processData(data, irangsImportDataId);
      await this.updateImportStatus(
        irangsImportDataId,
        IrangsImportStatusEnum.COMPLETED,
        data.length,
      );
    } catch (error) {
      await this.updateImportStatus(
        irangsImportDataId,
        IrangsImportStatusEnum.FAILED,
        null,
        'خطا در پردازش فایل: ' + error.message,
      );
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  private async processData(data: any[], irangsImportDataId: bigint) {
    const cleanedData = this.cleanData(data);
    const brandMap = await this.getOrCreateItems(
      this.brandRepository,
      cleanedData.map((row) => row['برند']),
    );
    const productTypeMap = await this.getOrCreateItems(
      this.productTypeRepository,
      cleanedData.map((row) => row['محصول']),
    );
    const variantMap = await this.getOrCreateItems(
      this.variantRepository,
      cleanedData.map((row) => row['مدل']),
    );
    const existingSerials = await this.getExistingSerials(
      cleanedData.map((row) => row['شناسه رهگیری']),
    );
    const guaranteePeriods = await this.guaranteePeriodRepository.findAll();
    const guaranteePeriodMap = new Map<string, number>();
    guaranteePeriods.forEach((period) => {
      guaranteePeriodMap.set(period.providerText, period.id);
    });

    const guaranteesToCreate = [];
    for (const row of cleanedData) {
      if (existingSerials.has(row['شناسه رهگیری'])) {
        continue;
      }

      const startDate = this.parseDate(row['تاریخ شروع']);
      const endDate = this.parseDate(row['تاریخ انقضا']);

      if (!startDate || !endDate) {
        continue;
      }

      const totalMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      const guaranteePeriodId =
        guaranteePeriodMap.get(`${totalMonths}MONTHS_PERIOD`) || 1;

      guaranteesToCreate.push({
        providerId: GSProviderEnum.IRANGS,
        brandId: brandMap.get(row['برند']),
        guaranteeTypeId: GSGuaranteeTypeEnum.Normal,
        guaranteePeriodId: guaranteePeriodId,
        guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm,
        serialNumber: row['شناسه رهگیری'],
        startDate: startDate,
        endDate: endDate,
        description: 'کانورت IRANGS',
        variantId: variantMap.get(row['مدل']),
        productTypeId: productTypeMap.get(row['محصول']),
      });
    }
    console.log(guaranteesToCreate.length);
    if (guaranteesToCreate.length > 0) {
      const newGuarantees = await this.guaranteeRepository.bulkCreate(
        guaranteesToCreate,
        { returning: true },
      );

      const linkingData = newGuarantees.map((guarantee) => ({
        irangsImportDataId: irangsImportDataId,
        guaranteeId: guarantee.id,
      }));
      await this.irangsImportDataGuaranteesRepository.bulkCreate(linkingData);
    }
    await this.updateProcessedRows(
      irangsImportDataId,
      guaranteesToCreate.length,
    );
  }

  private cleanData(data: any[]): any[] {
    return data.map((row) => {
      const newRow = {};
      for (const key in row) {
        const newKey = key.replace(/\u200c/g, '').trim();
        newRow[newKey] =
          typeof row[key] === 'string' ? row[key].trim() : row[key];
      }
      return newRow;
    });
  }

  private async getOrCreateItems(
    repository: any,
    values: string[],
  ): Promise<Map<string, number>> {
    const uniqueValues = [...new Set(values.filter(Boolean))];
    const itemMap = new Map<string, number>();
    const items = await repository.findAll({
      where: { title: { [Op.in]: uniqueValues } },
    });
    items.forEach((item) => itemMap.set(item.title, item.id));

    const itemsToCreate = uniqueValues.filter((value) => !itemMap.has(value));
    if (itemsToCreate.length > 0) {
      const newItems = await repository.bulkCreate(
        itemsToCreate.map((value) => ({ title: value, providerId: 1 })),
      );
      newItems.forEach((item) => itemMap.set(item.title, item.id));
    }

    return itemMap;
  }

  private async getExistingSerials(serials: string[]): Promise<Set<string>> {
    const existingSerials = await this.guaranteeRepository.findAll({
      where: {
        serialNumber: {
          [Op.in]: serials,
        },
      },
      attributes: ['serialNumber'],
    });
    return new Set(existingSerials.map((g) => g.serialNumber));
  }

  private parseDate(dateString: string | number): Date | null {
    if (!dateString) {
      return null;
    }
    try {
      if (typeof dateString === 'number') {
        // MS-DOS uses 1980-01-01 as its epoch.
        // Lotus 1-2-3 uses 1900-01-01 as its epoch.
        // Excel for Windows uses 1900-01-01 as its epoch and erroneously treats 1900 as a leap year.
        // Excel for Macintosh uses 1904-01-01 as its epoch.
        const excelEpoch = new Date(1899, 11, 30);
        const excelDate = new Date(
          excelEpoch.getTime() + dateString * 24 * 60 * 60 * 1000,
        );
        return excelDate;
      }
      const normalizedDate = this.normalizeDigits(dateString.toString());
      return new persianDate(normalizedDate.split('/').map(Number)).toDate();
    } catch (error) {
      return null;
    }
  }

  private normalizeDigits(s: string): string {
    const persian = '۰۱۲۳۴۵۶۷۸۹';
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    const trans = {
      ...Object.fromEntries(persian.split('').map((p, i) => [p, i.toString()])),
      ...Object.fromEntries(arabic.split('').map((a, i) => [a, i.toString()])),
    };
    return s.replace(/[۰-۹٠-٩]/g, (match) => trans[match]);
  }

  private async updateImportStatus(
    irangsImportDataId: bigint,
    statusId: number,
    totalRows?: number,
    error?: string,
  ) {
    const updateData: any = { statusId };
    if (totalRows !== null) {
      updateData.totalRows = totalRows;
    }
    if (error) {
      updateData.error = error;
    }
    await this.irangsImportDataRepository.update(updateData, {
      where: { id: irangsImportDataId },
    });
  }

  private async updateProcessedRows(
    irangsImportDataId: bigint,
    processedRows: number,
  ) {
    await this.irangsImportDataRepository.increment('processedRows', {
      by: processedRows,
      where: { id: irangsImportDataId },
    });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} has completed.`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.log(`Job ${job.id} has failed with error ${err.message}.`);
  }
}

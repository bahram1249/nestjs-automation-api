import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IRANGS_IMPORT_QUEUE } from './constants';
import { InjectModel } from '@nestjs/sequelize';
import { GSIrangsImportData } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data.entity';
import { User } from '@rahino/database';
import { IrangsImportDataGetDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSIrangsImportStatus } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-status.entity';
import { GSIrangsImportDataGuarantees } from '@rahino/localdatabase/models/guarantee/gs-irangs-import-data-guarantees.entity';
import { GSGuarantee } from '@rahino/localdatabase/models/guarantee/gs-guarantee.entity';
import * as XLSX from 'xlsx';
import { IrangsImportStatusEnum } from './enum';

@Injectable()
export class IrangsImportDataService {
  constructor(
    @InjectModel(GSIrangsImportData)
    private readonly irangsImportDataRepository: typeof GSIrangsImportData,
    @InjectModel(GSIrangsImportDataGuarantees)
    private readonly irangsImportDataGuaranteesRepository: typeof GSIrangsImportDataGuarantees,
    @InjectQueue(IRANGS_IMPORT_QUEUE) private irangsImportQueue: Queue,
  ) {}

  async upload(file: Express.Multer.File, user: User) {
    const irangsImportData = await this.irangsImportDataRepository.create({
      fileName: file.originalname,
      userId: user.id,
      statusId: IrangsImportStatusEnum.PENDING,
    });

    await this.irangsImportQueue.add(
      'import-irangs-data',
      {
        irangsImportDataId: irangsImportData.id,
        filePath: file.path,
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return {
      message: 'File uploaded and queued for processing.',
    };
  }

  async findAll(dto: IrangsImportDataGetDto) {
    const queryBuilder = new QueryOptionsBuilder().include([
      {
        model: User,
        as: 'user',
      },
      {
        model: GSIrangsImportStatus,
        as: 'status',
      },
    ]);
    const count = await this.irangsImportDataRepository.count(
      queryBuilder.build(),
    );
    const queryOptions = queryBuilder
      .limit(dto.limit)
      .offset(dto.offset)
      .order(['createdAt', 'DESC'])
      .build();

    const result = await this.irangsImportDataRepository.findAll(queryOptions);

    return {
      result,
      total: count,
    };
  }

  async download(id: bigint) {
    const importData = await this.irangsImportDataRepository.findByPk(id);
    if (!importData) {
      throw new NotFoundException('Import data not found');
    }

    const guarantees = await this.irangsImportDataGuaranteesRepository.findAll({
      where: {
        irangsImportDataId: id,
      },
      include: [
        {
          model: GSGuarantee,
          as: 'guarantee',
        },
      ],
    });

    const data = guarantees.map((g) => {
      return {
        serialNumber: g.guarantee.serialNumber,
        startDate: g.guarantee.startDate,
        endDate: g.guarantee.endDate,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guarantees');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const fileName = `guarantees-${importData.id}.xlsx`;

    return {
      buffer,
      fileName,
    };
  }

  async getSampleExcel() {
    const headers = [
      'برند',
      'محصول',
      'مدل',
      'شناسه رهگیری',
      'تاریخ شروع',
      'تاریخ انقضا',
    ];
    const data = [headers];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return {
      buffer,
      fileName: 'sample.xlsx',
    };
  }
}

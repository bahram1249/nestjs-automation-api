import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';
import { User } from '@rahino/database';
import { GetSupplierReportDto } from './dto';
import { Op } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  GSSupplierPerson,
  BPMNOrganization,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';
import { SupplierReportOutputDto } from './dto/supplier-report-output.dto';

@Injectable()
export class SupplierReportService {
  constructor(
    @InjectModel(GSSupplierPerson)
    private readonly repository: typeof GSSupplierPerson,
  ) {}

  private _buildQuery(dto: GetSupplierReportDto) {
    let builder = new QueryOptionsBuilder()
      .include([
        {
          model: User,
          as: 'user',
          attributes: ['firstname', 'lastname', 'username', 'phoneNumber'],
        },
        {
          model: GSGuaranteeOrganization,
          as: 'organization',
          attributes: ['id'],
          include: [
            {
              model: BPMNOrganization,
              as: 'organization',
              attributes: ['id', 'name'],
            },
          ],
        },
      ])
      .filterIf(dto.organizationId != null, {
        '$organization.organization.id$': dto.organizationId,
      });
    if (dto.search) {
      builder = builder.filter({
        [Op.or]: [
          { '$user.firstname$': { [Op.like]: `%${dto.search}%` } },
          { '$user.lastname$': { [Op.like]: `%${dto.search}%` } },
          { '$user.username$': { [Op.like]: `%${dto.search}%` } },
          { '$user.phoneNumber$': { [Op.like]: `%${dto.search}%` } },
        ],
      });
    }
    return builder;
  }

  async findAll(dto: GetSupplierReportDto) {
    const queryBuilder = this._buildQuery(dto);
    const count = await this.repository.count(queryBuilder.build());
    const result = await this.repository.findAll(
      queryBuilder.offset(dto.offset).limit(dto.limit).build(),
    );

    const mappedResult = result.map((item) => {
      const outputDto = new SupplierReportOutputDto();
      outputDto.id = item.id;
      outputDto.firstname = item.user.firstname;
      outputDto.lastname = item.user.lastname;
      outputDto.username = item.user.username;
      outputDto.phoneNumber = item.user.phoneNumber;
      outputDto.organization = item.organization.organization.name;
      return outputDto;
    });

    return {
      result: mappedResult,
      total: count,
    };
  }

  async exportExcel(dto: GetSupplierReportDto): Promise<Buffer> {
    const queryBuilder = this._buildQuery(dto);
    const users = await this.repository.findAll(queryBuilder.build());

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Suppliers');
    sheet.columns = [
      { header: 'شناسه', key: 'id', width: 10 },
      { header: 'نام', key: 'firstname', width: 25 },
      { header: 'نام خانوادگی', key: 'lastname', width: 25 },
      { header: 'نام کاربری', key: 'username', width: 25 },
      { header: 'تلفن همراه', key: 'phoneNumber', width: 20 },
      { header: 'سازمان', key: 'organization', width: 30 },
    ];

    for (const item of users) {
      sheet.addRow({
        id: item.id,
        firstname: item.user.firstname,
        lastname: item.user.lastname,
        username: item.user.username,
        phoneNumber: item.user.phoneNumber,
        organization: item.organization.organization.name,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}

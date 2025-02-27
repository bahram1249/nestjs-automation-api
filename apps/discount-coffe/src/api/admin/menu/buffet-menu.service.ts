import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Attachment } from '@rahino/database';
import { MenuDto, MenuGetDto } from './dto';
import { User } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
import { FileService } from '@rahino/file';
import { ThumbnailService } from '@rahino/thumbnail';
import * as path from 'path';
import * as _ from 'lodash';
import { Response } from 'express';
import * as fs from 'fs';
import { BuffetMenu } from '@rahino/localdatabase/models';

@Injectable()
export class BuffetMenuService {
  constructor(
    @InjectModel(BuffetMenu)
    private readonly repository: typeof BuffetMenu,
    @InjectModel(AttachmentType)
    private readonly attachmentTypeRepository: typeof AttachmentType,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    private readonly fileService: FileService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: MenuGetDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder
      .include([
        {
          model: Attachment,
          as: 'cover',
          required: false,
        },
      ])
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BuffetMenu.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    if (filter.buffetId) {
      builder.filter({
        buffetId: filter.buffetId,
      });
    }
    const count = await this.repository.count(builder.build());
    const options = builder
      .include([
        {
          attributes: ['id', 'fileName', 'createdAt', 'updatedAt'],
          model: Attachment,
          as: 'cover',
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async create(user: User, dto: MenuDto, file?: Express.Multer.File) {
    let attachmentId = null;

    // if cover is attached
    if (file) {
      const attachmentTypeId = 4;
      const attachmentType = await this.attachmentTypeRepository.findOne({
        where: {
          id: attachmentTypeId,
        },
      });
      if (!attachmentType) throw new ForbiddenException();
      // save path from config
      const bigPath = this.fileService.generateProfilePathByCwd(user.id);
      const thumbPath = this.fileService.generateProfileThumbPathByCwd(user.id);

      // create thumbnail and save
      const bigThumb = await this.thumbnailService.resize(file.path, 700, 700);
      const smallThumb = await this.thumbnailService.resize(
        file.path,
        300,
        300,
      );
      const realPath = await this.fileService.saveFileByPathAsync(
        bigPath.cwdPath,
        file.filename,
        bigThumb,
      );
      const thumbRealPath = await this.fileService.saveFileByPathAsync(
        thumbPath.cwdPath,
        file.filename,
        smallThumb,
      );

      await this.fileService.removeFileAsync(file.path);
      const attachment = await this.attachmentRepository.create({
        originalFileName: file.originalname,
        fileName: file.filename,
        ext: path.extname(file.filename),
        mimetype: file.mimetype,
        userId: user.id,
        attachmentTypeId: attachmentTypeId,
        path: path.join(bigPath.savePath, '/', file.filename),
        thumbnailPath: path.join(thumbPath.savePath, '/', file.filename),
      });
      attachmentId = attachment.id;
    }

    let menu: any = _.pick(dto, [
      'title',
      'price',
      'menuCategoryId',
      'buffetId',
    ]);

    menu.userId = user.id;
    if (attachmentId) menu.attachmentId = attachmentId;
    menu = await this.repository.create(menu);

    return {
      result: menu,
    };
  }

  async edit(id: bigint, user: User, dto: MenuDto, file?: Express.Multer.File) {
    const menu = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    if (!menu) throw new NotFoundException();
    let attachmentId = null;

    if (file) {
      const attachmentTypeId = 4;
      const attachmentType = await this.attachmentTypeRepository.findOne({
        where: {
          id: attachmentTypeId,
        },
      });
      if (!attachmentType) throw new ForbiddenException();
      // save path from config
      const bigPath = this.fileService.generateProfilePathByCwd(user.id);
      const thumbPath = this.fileService.generateProfileThumbPathByCwd(user.id);

      // create thumbnail and save
      const bigThumb = await this.thumbnailService.resize(file.path, 700, 700);
      const smallThumb = await this.thumbnailService.resize(
        file.path,
        300,
        300,
      );
      const realPath = await this.fileService.saveFileByPathAsync(
        bigPath.cwdPath,
        file.filename,
        bigThumb,
      );
      const thumbRealPath = await this.fileService.saveFileByPathAsync(
        thumbPath.cwdPath,
        file.filename,
        smallThumb,
      );

      this.fileService.removeFileAsync(file.path);

      const attachment = await this.attachmentRepository.create({
        originalFileName: file.originalname,
        fileName: file.filename,
        ext: path.extname(file.filename),
        mimetype: file.mimetype,
        userId: user.id,
        attachmentTypeId: attachmentTypeId,
        path: path.join(bigPath.savePath, '/', file.filename),
        thumbnailPath: path.join(thumbPath.savePath, '/', file.filename),
      });
      attachmentId = attachment.id;
    }
    const menuDto: any = _.pick(dto, [
      'title',
      'buffetId',
      'price',
      'menuCategoryId',
    ]);
    if (attachmentId) menuDto.attachmentId = attachmentId;
    await this.repository.update(menuDto, {
      where: {
        id: id,
      },
    });
    return {
      result: menuDto,
    };
  }

  async deleteById(user: User, entityId: number) {
    const menu = await this.repository.findOne({
      where: {
        id: entityId,
      },
    });
    if (!menu) throw new NotFoundException();

    await this.repository.update(
      {
        isDeleted: true,
        deletedBy: user.id,
      },
      {
        where: {
          id: entityId,
        },
      },
    );

    return {
      result: menu,
    };
  }
  async getPhoto(res: Response, fileName: string): Promise<StreamableFile> {
    const attachment = await this.attachmentRepository.findOne({
      where: {
        [Op.and]: [
          {
            fileName: fileName,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
          {
            attachmentTypeId: 4,
          },
        ],
      },
    });
    if (!attachment) throw new NotFoundException();
    res.set({
      'Content-Type': attachment.mimetype,
      'Content-Disposition': `filename="${attachment.fileName}"`,
    });
    const file = fs.createReadStream(path.join(process.cwd(), attachment.path));
    return new StreamableFile(file);
  }

  async findById(entityId: number) {
    throw new NotImplementedException();
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Buffet } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Attachment } from '@rahino/database';
import { BuffetDto } from './dto';
import { User } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
import { FileService } from '@rahino/file';
import { ThumbnailService } from '@rahino/thumbnail';
import * as path from 'path';
import * as _ from 'lodash';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { BuffetOption } from '@rahino/localdatabase/models';
import { replaceCharacterSlug } from '@rahino/commontools';
import { BuffetGallery } from '@rahino/localdatabase/models';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
    @InjectModel(AttachmentType)
    private readonly attachmentTypeRepository: typeof AttachmentType,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(BuffetOption)
    private readonly buffetOptionRepository: typeof BuffetOption,
    @InjectModel(BuffetGallery)
    private readonly buffetGalleryRepository: typeof BuffetGallery,
    private readonly fileService: FileService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: ListFilter) {
    let builder = new QueryOptionsBuilder();
    builder = builder.filter({
      title: {
        [Op.like]: filter.search,
      },
    });
    const count = await this.repository.count(builder.build());
    const options = builder
      .include([
        {
          model: Attachment,
          as: 'coverAttachment',
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

  async create(user: User, dto: BuffetDto, file?: Express.Multer.File) {
    let attachmentId = null;
    const coffeRole: number = 2;
    const role = await this.roleRepository.findOne({
      where: {
        static_id: coffeRole,
      },
    });
    if (!role) throw new BadRequestException();

    // if cover is attached
    if (file) {
      const attachmentTypeId = 2;
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

    // owner user of coffe
    let ownedUser: any = _.pick(dto, ['firstname', 'lastname', 'username']);
    ownedUser.password = ownedUser.username;
    ownedUser = await this.userRepository.create(ownedUser);

    // add coffe role for this user
    const userRole = await this.userRoleRepository.create({
      userId: ownedUser.id,
      roleId: role.id,
    });

    if (dto.urlAddress == null) {
      dto.urlAddress = replaceCharacterSlug(dto.title);
    }

    let buffet: any = _.pick(dto, [
      'title',
      'urlAddress',
      'buffetTypeId',
      'percentDiscount',
      'buffetDescription',
      'buffetAddress',
      'buffetPhone',
      'wazeLink',
      'neshanLink',
      'baladLink',
      'googleMapLink',
      'latitude',
      'longitude',
      'buffetCostId',
      'cityId',
      'pin',
    ]);
    buffet.userId = user.id;
    buffet.ownerId = ownedUser.id;
    buffet.viewCount = 1;
    if (attachmentId) buffet.coverAttachmentId = attachmentId;
    buffet = await this.repository.create(buffet);

    if (dto.options.length > 0) {
      for (let index = 0; index < dto.options.length; index++) {
        const optionId = dto.options[index];
        await this.buffetOptionRepository.create({
          buffetId: buffet.id,
          optionId: optionId,
        });
      }
    }

    if (dto.galleries.length > 0) {
      for (let index = 0; index < dto.galleries.length; index++) {
        const galleryItem = dto.galleries[index];
        const findAttachment = await this.attachmentRepository.findOne({
          where: {
            fileName: galleryItem,
          },
        });
        const buffetGallery = await this.buffetGalleryRepository.create({
          buffetId: buffet.id,
          attachmentId: findAttachment.id,
        });
      }
    }

    return {
      result: buffet,
    };
  }

  async edit(
    id: bigint,
    user: User,
    dto: BuffetDto,
    file?: Express.Multer.File,
  ) {
    const buffet = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    if (!buffet) throw new NotFoundException();
    let attachmentId = null;
    if (file) {
      const attachmentTypeId = 2;
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
      const bigThumb = await this.thumbnailService.resize(
        file.path,
        1024,
        1024,
      );
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
    const owner = await this.userRepository.findOne({
      where: {
        id: buffet.ownerId,
      },
    });
    if (!owner) throw new NotFoundException();
    let ownedUser: any = _.pick(dto, ['firstname', 'lastname', 'username']);
    ownedUser = await this.userRepository.update(ownedUser, {
      where: {
        id: buffet.ownerId,
      },
    });

    if (dto.urlAddress == null) {
      dto.urlAddress = replaceCharacterSlug(dto.title);
    }

    const buffetDto: any = _.pick(dto, [
      'title',
      'urlAddress',
      'buffetTypeId',
      'percentDiscount',
      'buffetDescription',
      'buffetAddress',
      'buffetPhone',
      'wazeLink',
      'neshanLink',
      'baladLink',
      'googleMapLink',
      'latitude',
      'longitude',
      'buffetCostId',
      'cityId',
      'pin',
    ]);
    if (attachmentId) buffetDto.coverAttachmentId = attachmentId;
    await this.repository.update(buffetDto, {
      where: {
        id: id,
      },
    });

    await this.buffetOptionRepository.destroy({ where: { buffetId: id } });
    if (dto.options.length > 0) {
      for (let index = 0; index < dto.options.length; index++) {
        const optionId = dto.options[index];
        await this.buffetOptionRepository.create({
          buffetId: buffet.id,
          optionId: optionId,
        });
      }
    }

    await this.buffetGalleryRepository.destroy({ where: { buffetId: id } });
    if (dto.galleries.length > 0) {
      for (let index = 0; index < dto.galleries.length; index++) {
        const galleryItem = dto.galleries[index];
        const findAttachment = await this.attachmentRepository.findOne({
          where: {
            fileName: galleryItem,
          },
        });
        const buffetGallery = await this.buffetGalleryRepository.create({
          buffetId: buffet.id,
          attachmentId: findAttachment.id,
        });
      }
    }

    return {
      result: buffet,
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
            attachmentTypeId: 2,
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

  async uploadGallery(user: User, file: Express.Multer.File) {
    const attachmentTypeId = 12;
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
    const bigThumb = await this.thumbnailService.resize(file.path, 1024, 1024);
    const smallThumb = await this.thumbnailService.resize(file.path, 300, 300);
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
    return {
      result: _.pick(attachment, ['id', 'fileName']),
    };
  }

  async showGallery(res: Response, fileName: string): Promise<StreamableFile> {
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
            attachmentTypeId: 12,
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
}

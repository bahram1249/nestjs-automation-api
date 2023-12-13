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
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { BuffetDto } from './dto';
import { User } from '@rahino/database/models/core/user.entity';
import { AttachmentType } from '@rahino/database/models/core/attachmentType.entity';
import { FileService } from '@rahino/file';
import { ThumbnailService } from '@rahino/thumbnail';
import * as path from 'path';
import * as _ from 'lodash';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from '@rahino/database/models/core/role.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';

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
    ]);
    buffet.userId = user.id;
    buffet.ownerId = ownedUser.id;
    buffet.viewCount = 1;
    if (attachmentId) buffet.coverAttachmentId = attachmentId;
    buffet = await this.repository.create(buffet);
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
    let owner = await this.userRepository.findOne({
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
    ]);
    if (attachmentId) buffetDto.coverAttachmentId = attachmentId;
    await this.repository.update(buffetDto, {
      where: {
        id: id,
      },
    });
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
}

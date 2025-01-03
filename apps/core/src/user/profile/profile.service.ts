import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
import { User } from '@rahino/database';
import * as path from 'path';
import * as fs from 'fs';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import type { Response } from 'express';
import { FileService } from '@rahino/file/file.service';
import { ThumbnailService } from '@rahino/thumbnail';
import { EditProfileDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Attachment)
    private readonly repository: typeof Attachment,
    @InjectModel(AttachmentType)
    private readonly attachmentTypeRepository: typeof AttachmentType,
    @InjectModel(User)
    private readonly userRepoisitory: typeof User,
    private readonly fileService: FileService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async editProfile(user: User, dto: EditProfileDto) {
    await this.userRepoisitory.update(
      {
        firstname: dto.firstname,
        lastname: dto.lastname,
        birthDate: dto.birthDate,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
    const editedUser = await this.userRepoisitory.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'firstname', 'lastname', 'birthDate'])
        .filter({ id: user.id })
        .build(),
    );
    return {
      result: editedUser,
    };
  }

  async upload(userId: bigint, file: Express.Multer.File) {
    // check attachment Type
    const attachmentTypeId = 1;
    const attachmentType = await this.attachmentTypeRepository.findOne({
      where: {
        id: attachmentTypeId,
      },
    });
    if (!attachmentType) throw new ForbiddenException();

    // find user
    let user = await this.userRepoisitory.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException();
    if (user.profilePhotoAttachmentId) {
      // remove old attachment
      const attachmentOld = await this.repository.findOne({
        where: {
          id: user.profilePhotoAttachmentId,
        },
      });
      await this.fileService.removeFilePathByCwd(attachmentOld.path);
      await this.fileService.removeFilePathByCwd(attachmentOld.thumbnailPath);
      await this.repository.update(
        {
          isDeleted: true,
          deletedDate: Sequelize.fn('getdate'),
          deletedBy: userId,
        },
        {
          where: {
            id: attachmentOld.id,
          },
        },
      );
    }
    // save path from config
    const bigPath = this.fileService.generateProfilePathByCwd(userId);
    const thumbPath = this.fileService.generateProfileThumbPathByCwd(userId);

    // create thumbnail and save
    const bigThumb = await this.thumbnailService.resize(file.path, 700, 700);
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

    this.fileService.removeFileAsync(file.path);
    const attachment = await this.repository.create({
      originalFileName: file.originalname,
      fileName: file.filename,
      ext: path.extname(file.filename),
      mimetype: file.mimetype,
      userId: userId,
      attachmentTypeId: attachmentTypeId,
      path: path.join(bigPath.savePath, '/', file.filename),
      thumbnailPath: path.join(thumbPath.savePath, '/', file.filename),
    });
    user.profilePhotoAttachmentId = attachment.id;
    user = await user.save();
    user = await this.userRepoisitory.findOne({
      attributes: ['id', 'firstname', 'lastname'],
      include: [
        {
          attributes: [
            'id',
            'originalFileName',
            'fileName',
            'mimetype',
            'createdAt',
            'updatedAt',
          ],
          model: Attachment,
          as: 'profileAttachment',
        },
      ],
      where: {
        id: user.id,
      },
    });
    //fs.writeFileSync(attachmentSavePath, file.buffer);
    return {
      result: user,
    };
  }

  async getPhoto(res: Response, fileName: string): Promise<StreamableFile> {
    const attachment = await this.repository.findOne({
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
            attachmentTypeId: 1,
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

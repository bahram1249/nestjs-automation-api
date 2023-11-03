import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from 'apps/core/src/database/sequelize/models/core/attachment.entity';
import { AttachmentType } from 'apps/core/src/database/sequelize/models/core/attachmentType.entity';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import type { Response } from 'express';
import * as sharp from 'sharp';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Attachment)
    private readonly repository: typeof Attachment,
    @InjectModel(AttachmentType)
    private readonly attachmentTypeRepository: typeof AttachmentType,
    @InjectModel(User)
    private readonly userRepoisitory: typeof User,
    private readonly config: ConfigService,
  ) {}
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
      fs.rmSync(path.join(process.cwd(), attachmentOld.path));
      fs.rmSync(path.join(process.cwd(), attachmentOld.thumbnailPath));
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
    const savePath = this.config
      .get<string>('PROFILE_PATH_ATTACHMENT')
      .concat(`/${userId}`);
    const saveThumbPath = this.config.get<string>(
      'PROFILE_PATH_THUMB_ATTACHMENT',
    );

    // create directory if not exists
    fs.mkdirSync(path.join(process.cwd(), savePath), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), saveThumbPath), { recursive: true });

    // real save path
    const attachmentSavePath = path.join(
      process.cwd(),
      savePath,
      file.filename,
    );

    const attachmentThumbSavePath = path.join(
      process.cwd(),
      saveThumbPath,
      file.filename,
    );

    // create thumbnail and save
    const bigThumb = await sharp(file.path).resize(700, 700).toBuffer();
    const smallThumb = await sharp(file.path).resize(200, 200).toBuffer();
    fs.writeFileSync(attachmentSavePath, bigThumb);
    fs.writeFileSync(attachmentThumbSavePath, smallThumb);

    fs.rmSync(file.path);
    const attachment = await this.repository.create({
      originalFileName: file.originalname,
      fileName: file.filename,
      ext: path.extname(file.filename),
      mimetype: file.mimetype,
      userId: userId,
      attachmentTypeId: attachmentTypeId,
      path: savePath.concat('/', file.filename),
      thumbnailPath: saveThumbPath.concat('/', file.filename),
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

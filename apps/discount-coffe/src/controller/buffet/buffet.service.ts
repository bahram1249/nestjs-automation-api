import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';
import { Op, Sequelize } from 'sequelize';
import { ReserveDto } from './dto';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@rahino/database/models/core/user.entity';
import { Response, Request } from 'express';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { BuffetReserveDetail } from '@rahino/database/models/discount-coffe/buffet-reserve-detail.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
const mkdirAsync = util.promisify(fs.mkdir);

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
    @InjectModel(BuffetMenuCategory)
    private readonly buffetMenuCategoryRepository: typeof BuffetMenuCategory,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(BuffetReserve)
    private readonly buffetReserveRepository: typeof BuffetReserve,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectModel(BuffetMenu)
    private readonly buffetMenuRepository: typeof BuffetMenu,
    @InjectModel(BuffetReserveDetail)
    private readonly buffetReserveDetailRepository: typeof BuffetReserveDetail,
    @InjectModel(BuffetType)
    private readonly buffetTypeRepository: typeof BuffetType,
    @InjectModel(BuffetCost)
    private readonly buffetCostRepository: typeof BuffetCost,
    private readonly config: ConfigService,
  ) {}

  async index(urlAddress: string) {
    const buffet = await this.repository.findOne({
      include: [
        {
          model: Attachment,
          as: 'coverAttachment',
          required: false,
        },
        {
          model: CoffeOption,
          as: 'coffeOptions',
          required: false,
        },
      ],
      where: {
        urlAddress: urlAddress,
      },
    });
    if (!buffet) throw new NotFoundException();
    const viewCount = Number(buffet.viewCount) + 1;
    await this.repository.update(
      {
        viewCount: viewCount,
      },
      {
        where: {
          id: buffet.id,
        },
        silent: true,
      },
    );
    return {
      title: buffet.title,
      layout: 'discountcoffe',
      buffet: buffet.toJSON(),
    };
  }

  async menus(urlAddress: string) {
    const buffet = await this.repository.findOne({
      include: [
        {
          model: Attachment,
          as: 'coverAttachment',
          required: false,
        },
      ],
      where: {
        urlAddress: urlAddress,
      },
    });
    if (!buffet) throw new NotFoundException();
    const buffetMenuCategories =
      await this.buffetMenuCategoryRepository.findAll({
        include: [
          {
            include: [
              {
                model: Attachment,
                as: 'cover',
                required: false,
              },
            ],
            model: BuffetMenu,
            as: 'menus',
            required: true,
            where: {
              [Op.and]: [
                {
                  buffetId: buffet.id,
                },
                Sequelize.where(
                  Sequelize.fn('isnull', Sequelize.col('menus.isDeleted'), 0),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            model: Attachment,
            as: 'cover',
            required: false,
          },
        ],
      });

    const convertDateFormat = 103;
    const increase = 14;
    const today = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn('getdate'),
          convertDateFormat,
        ),
      }),
    });
    const endDate = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            increase,
            Sequelize.fn('getdate'),
          ),
          convertDateFormat,
        ),
      }),
    });

    return {
      title: 'رزرو از ' + buffet.title,
      layout: 'discountcoffe',
      buffet: buffet.toJSON(),
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
      today: today.toJSON(),
      endDate: endDate.toJSON(),
    };
  }

  async setReserve(dto: ReserveDto) {
    const onlineReserve = 1;
    if (dto.reserveType == onlineReserve && dto.items.length == 0) {
      throw new BadRequestException('Must select 1 menus.');
    }

    const increase = 14;
    const reserveIncompoleteStatus = 1;
    const reserveDate = await this.persianDateRepository.findOne({
      where: {
        [Op.and]: [
          {
            YearMonthDay: dto.reserveDate,
          },
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.lte]: Sequelize.fn(
              'dateadd',
              Sequelize.literal('day'),
              increase,
              Sequelize.fn('getdate'),
            ),
          }),
        ],
      },
    });
    if (!reserveDate)
      throw new BadRequestException('The Given Date not valid.');

    const data = {
      reserveDate: Sequelize.cast(reserveDate.GregorianDate, 'DATETIME'),
      reserveStatusId: reserveIncompoleteStatus,
      personCount: dto.personCount,
      buffetId: dto.buffetId,
      uniqueCode: uuidv4(),
      reserveTypeId: dto.reserveType,
    };

    let buffetReserve = await this.buffetReserveRepository.create(data);
    if (dto.items.length > 0) {
      const menusIds = dto.items.map((item) => item.id);
      const menus = await this.buffetMenuRepository.findAll({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.in]: menusIds,
              },
            },
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          ],
        },
      });

      let totalPrice = 0;
      for (let index = 0; index < menus.length; index++) {
        const menu = menus[index];
        const item = dto.items.find((item) => item.id == menu.id);

        var count = parseInt(item.count.toString());
        var itemTotalPrice = Number(menu.price) * count;
        totalPrice += itemTotalPrice;
        await this.buffetReserveDetailRepository.create({
          reserveId: buffetReserve.id,
          menuId: menu.id,
          price: menu.price,
          totalPrice: itemTotalPrice,
          countItem: item.count,
        });
      }
      await this.buffetReserveRepository.update(
        { price: totalPrice },
        {
          where: {
            id: buffetReserve.id,
          },
        },
      );
    }

    return {
      result: buffetReserve.toJSON(),
    };
  }

  async completeReserve(req: Request, res: Response, user: User, code: string) {
    const reserverCompleteStatus = 2;
    const incompleteStatus = 1;
    let reserve = await this.buffetReserveRepository.findOne({
      where: {
        uniqueCode: code,
        reserveStatusId: incompleteStatus,
      },
    });
    if (!reserve) throw new NotFoundException();
    reserve.userId = user.id;
    reserve.reserveStatusId = reserverCompleteStatus;

    const savePath = this.config.get('QR_PATH');
    await mkdirAsync(path.join(process.cwd(), savePath), { recursive: true });
    await QRCode.toFile(
      savePath + '/' + code + '.png',
      '/buffet/detail/' + code,
    );

    const attachmentTypeId = 5;

    const attachment = await this.attachmentRepository.create({
      originalFileName: code + '.png',
      fileName: code + '.png',
      ext: '.png',
      mimetype: 'image/png',
      path: savePath + '/' + code + '.png',
      attachmentTypeId: attachmentTypeId,
      userId: user.id,
    });
    reserve.attachmentId = attachment.id;
    reserve = await reserve.save();

    return res.redirect(302, '/buffet/detail/' + code);
  }

  async detail(user: User, code: string) {
    const completeReserve = 2;
    const reserve = await this.buffetReserveRepository.findOne({
      include: [
        {
          model: Buffet,
          as: 'buffet',
        },
        {
          model: Attachment,
          as: 'attachment',
        },
        {
          model: User,
          as: 'user',
        },
        {
          model: PersianDate,
          as: 'persianDate',
          on: Sequelize.literal(
            'convert(date, [BuffetReserve].[reserveDate], 103) = [persianDate].[GregorianDate]',
          ),
        },
      ],
      where: {
        uniqueCode: code,
        userId: user.id,
        reserveStatusId: completeReserve,
      },
    });
    if (!reserve) throw new NotFoundException();
    return {
      layout: 'discountcoffe',
      reserve: reserve.toJSON(),
      title: 'نمایش بلیط',
    };
  }

  async getQr(res: Response, fileName: string): Promise<StreamableFile> {
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
            attachmentTypeId: 5,
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

  async list() {
    const buffetTypes = await this.buffetTypeRepository.findAll();
    const buffetCosts = await this.buffetCostRepository.findAll();
    return {
      title: 'لیست کافه و رستوران ها',
      layout: 'discountcoffe',
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
    };
  }
}

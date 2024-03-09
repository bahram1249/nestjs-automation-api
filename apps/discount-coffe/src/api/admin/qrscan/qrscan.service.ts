import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database/models/core/user.entity';
import { QrScanDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class QrScanService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly reserveRepository: typeof BuffetReserve,
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}

  async confirmReserve(user: User, dto: QrScanDto) {
    let reserve = await this.reserveRepository.findOne(
      new QueryOptionsBuilder().filter({ uniqueCode: dto.reserveId }).build(),
    );
    if (!reserve) {
      throw new BadRequestException('هیچ رزروی یافت نشد');
    }
    const reserveDate = reserve.reserveDate.setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    if (reserveDate != today) {
      throw new BadRequestException('تاریخ رزرو برای امروز نیست');
    }
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ ownerId: user.id })
        .filter({ id: reserve.buffetId })
        .build(),
    );
    if (!buffet) {
      throw new BadRequestException('رزرو کافه برای شما نیست');
    }
    reserve = await this.reserveRepository.update(
      {
        isQrScan: true,
        qrScanDate: Sequelize.fn('getdate'),
        qrScanBy: user.id,
      },
      { where: { id: reserve.id } },
    )[1][0];
    return {
      result: reserve,
    };
  }
}

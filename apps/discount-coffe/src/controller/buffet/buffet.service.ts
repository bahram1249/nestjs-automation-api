import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
  ) {}

  async get(urlAddress: string) {
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
    return {
      title: buffet.title,
      layout: 'discountcoffe',
      buffet: buffet.toJSON(),
    };
  }
}

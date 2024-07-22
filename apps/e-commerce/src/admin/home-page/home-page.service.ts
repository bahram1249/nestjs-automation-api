import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { ListFilter } from '@rahino/query-filter';
import { HomePageDto } from './dto/home-page.dto';
import { ECHomePage } from '@rahino/database/models/ecommerce-eav/ec-home-page.entity';
import { HomePageTypeEnum } from './dto/home-page-type.enum';
import { HomePageValidatorService } from './home-page-validator.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class HomePageService {
  constructor(
    @InjectModel(ECHomePage)
    private readonly repository: typeof ECHomePage,
    private readonly homePageValidatorService: HomePageValidatorService,
  ) {}

  async findAll(filter: ListFilter) {
    const items = await this.repository.findAll(
      new QueryOptionsBuilder().filter({ isDeleted: 0 }).build(),
    );
    const result = items
      .sort((item) => item.priority)
      .map((item) => item.jsonContent);
    return {
      result: result,
    };
  }

  async create(dto: HomePageDto, user: User) {
    for (let index = 0; index < dto.data.length; index++) {
      const item = dto.data[index];
      if (item.type == HomePageTypeEnum.SLIDER) {
        await this.homePageValidatorService.sliderValidator(item);
      } else if (item.type == HomePageTypeEnum.BANNER) {
        await this.homePageValidatorService.bannerValidator(item);
      } else if (item.type == HomePageTypeEnum.PRODUCTCATEGORY) {
        await this.homePageValidatorService.productCategoryValidator(item);
      } else if (item.type == HomePageTypeEnum.PRODUCTBRAND) {
        await this.homePageValidatorService.productBrandValidator(item);
      } else if (item.type == HomePageTypeEnum.CATEGORY) {
        await this.homePageValidatorService.categoryValidator(item);
      } else if (item.type == HomePageTypeEnum.BRAND) {
        await this.homePageValidatorService.brandValidator(item);
      }
    }

    await this.repository.update(
      { isDeleted: true },
      {
        where: {
          isDeleted: 0,
        },
      },
    );

    for (let index = 0; index < dto.data.length; index++) {
      const item = dto.data[index];
      await this.repository.create({
        userId: user.id,
        isDeleted: 0,
        jsonContent: JSON.stringify(item),
        priority: item.priority,
      });
    }

    return {
      result: 'ok',
    };
  }
}

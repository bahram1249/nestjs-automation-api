import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { HomePageDto } from './dto/home-page.dto';
import { ECHomePage } from '@rahino/localdatabase/models';
import { HomePageValidatorService } from './home-page-validator.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  HOME_PAGE_JOB,
  HOME_PAGE_QUEUE,
} from '@rahino/ecommerce/client/home/constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { HomePageTypeEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class HomePageService {
  constructor(
    @InjectModel(ECHomePage)
    private readonly repository: typeof ECHomePage,
    private readonly homePageValidatorService: HomePageValidatorService,
    @InjectQueue(HOME_PAGE_QUEUE)
    private readonly homePageQueue: Queue,
  ) {}

  async findAll(filter: ListFilter) {
    const items = await this.repository.findAll(
      new QueryOptionsBuilder().filter({ isDeleted: 0 }).build(),
    );
    const result = items
      .sort((item) => item.priority)
      .map((item) => JSON.parse(item.jsonContent));
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
      } else if (item.type == HomePageTypeEnum.AMAZING) {
        await this.homePageValidatorService.amazingContentValidator(item);
      } else if (item.type == HomePageTypeEnum.PRODUCT) {
        await this.homePageValidatorService.productValidator(item);
      } else if (item.type == HomePageTypeEnum.SELECTEDPRODUCT) {
        await this.homePageValidatorService.selectedProductValidator(item);
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

    this.homePageQueue.add(
      HOME_PAGE_JOB,
      {},
      {
        removeOnComplete: true,
      },
    );

    return {
      result: 'ok',
    };
  }
}

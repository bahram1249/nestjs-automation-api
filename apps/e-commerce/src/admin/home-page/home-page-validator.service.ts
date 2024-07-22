import { BadRequestException, Injectable } from '@nestjs/common';
import { HomePageDataDto } from './dto';
import { BannerContentDto } from './dto/content/banner-content.dto';
import { SliderContentDto } from './dto/content/slider-content.dto';
import { ProductCategoryContentDto } from './dto/content/product-category-content.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ECEntityTypeSort } from '@rahino/database/models/ecommerce-eav/ec-entityType-sort.entity';
import { ProductBrandContentDto } from './dto/content/product-brand-content.dto';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { CategoryContentDto } from './dto/content/category-content.dto';
import { BrandContentDto } from './dto/content/brand-content.dto';

@Injectable()
export class HomePageValidatorService {
  private homePagePhotoAttachmentType = 13;
  constructor(
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(ECBrand)
    private readonly brandRepository: typeof ECBrand,
    @InjectModel(ECEntityTypeSort)
    private readonly entityTypeSortRepository: typeof ECEntityTypeSort,
  ) {}

  async bannerValidator(dto: HomePageDataDto) {
    const bannerContentArray = dto.content as Array<BannerContentDto>;
    for (let index = 0; index < bannerContentArray.length; index++) {
      const bannerContent = bannerContentArray[index];
      const findAttachment = await this.findAttachment(
        bannerContent.imageAttachmentId,
      );
      if (!findAttachment) {
        throw new BadRequestException(
          `the attachment with this given id (${bannerContent.imageAttachmentId}) is not founded!`,
        );
      }
    }
  }

  async sliderValidator(dto: HomePageDataDto) {
    const sliderContentArray = dto.content as Array<SliderContentDto>;
    for (let index = 0; index < sliderContentArray.length; index++) {
      const sliderContent = sliderContentArray[index];
      const findAttachment = await this.findAttachment(
        sliderContent.imageAttachmentId,
      );
      if (!findAttachment) {
        throw new BadRequestException(
          `the attachment with this given id (${sliderContent.imageAttachmentId}) is not founded!`,
        );
      }
    }
  }

  async productCategoryValidator(dto: HomePageDataDto) {
    const productContent = dto.content as unknown as ProductCategoryContentDto;
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: productContent.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!entityType) {
      throw new BadRequestException(
        `the entityTypeId with this given id (${productContent.entityTypeId}) is not founded!`,
      );
    }

    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: productContent.sortBy }).build(),
    );
    if (!sort) {
      throw new BadRequestException(
        `the entityTypeSortBy-> ${productContent.sortBy} not founded!`,
      );
    }
  }

  async productBrandValidator(dto: HomePageDataDto) {
    const productContent = dto.content as unknown as ProductBrandContentDto;
    const brand = await this.brandRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: productContent.brandId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!brand) {
      throw new BadRequestException(
        `the brandId with this given id (${productContent.brandId}) is not founded!`,
      );
    }

    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: productContent.sortBy }).build(),
    );
    if (!sort) {
      throw new BadRequestException(
        `the entityTypeSortBy-> ${productContent.sortBy} not founded!`,
      );
    }
  }

  async categoryValidator(dto: HomePageDataDto) {
    const categoryContent = dto.content as unknown as CategoryContentDto;
  }

  async brandValidator(dto: HomePageDataDto) {
    const brandContent = dto.content as unknown as BrandContentDto;
  }

  private async findAttachment(attachmentId: number) {
    const find = await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: attachmentId })
        .filter({ attachmentTypeId: this.homePagePhotoAttachmentType })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Attachment.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    return find;
  }
}

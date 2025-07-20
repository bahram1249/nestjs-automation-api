import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECHomePage } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { HomePageTypeEnum } from '../../shared/enum';
import { BrandContentDto } from '../../admin/home-page-section/home-page/dto/content/brand-content.dto';
import { CategoryContentDto } from '../../admin/home-page-section/home-page/dto/content/category-content.dto';
import { ConfigService } from '@nestjs/config';
import { ProductCategoryContentDto } from '../../admin/home-page-section/home-page/dto/content/product-category-content.dto';
import { ECEntityTypeSort } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ProductBrandContentDto } from '../../admin/home-page-section/home-page/dto/content/product-brand-content.dto';
import { ECBrand } from '@rahino/localdatabase/models';
import { AmazingContentDto } from '../../admin/home-page-section/home-page/dto/content/amazing-content.dto';
import { SliderContentDto } from '../../admin/home-page-section/home-page/dto/content/slider-content.dto';
import { Attachment } from '@rahino/database';
import { BannerContentDto } from '../../admin/home-page-section/home-page/dto/content/banner-content.dto';
import { ProductContentDto } from '../../admin/home-page-section/home-page/dto/content/product-content.dto';
import { SelectedProductContentDto } from '../../admin/home-page-section/home-page/dto/content/selected-product-content.dto';

@Injectable()
export class ProcessHomeService {
  private homeAttachmentTypeId = 13;
  private amazingTypeId = 2;
  constructor(
    @InjectModel(ECHomePage)
    private readonly repository: typeof ECHomePage,
    @InjectModel(ECEntityTypeSort)
    private readonly entityTypeSortRepository: typeof ECEntityTypeSort,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(ECBrand)
    private readonly brandRepository: typeof ECBrand,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    private readonly config: ConfigService,
  ) {}

  async processAll() {
    const queryBuilder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECHomePage.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .order({ orderBy: 'priority', sortOrder: 'asc' });
    const items = await this.repository.findAll(queryBuilder.build());

    const results = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const processedItem = await this.processItem(item);
      results.push(processedItem);
    }

    return results;
  }

  async processItem(item: ECHomePage) {
    const parseObj = JSON.parse(item.jsonContent);
    let resultObj;
    switch (parseObj.type) {
      case HomePageTypeEnum.PRODUCTCATEGORY:
        resultObj = await this.processProductCategory(
          parseObj.priority,
          parseObj.content as ProductCategoryContentDto,
        );
        break;
      case HomePageTypeEnum.PRODUCTBRAND:
        resultObj = await this.processProductBrand(
          parseObj.priority,
          parseObj.content as ProductBrandContentDto,
        );
        break;
      case HomePageTypeEnum.AMAZING:
        resultObj = await this.processAmazing(
          parseObj.priority,
          parseObj.content as AmazingContentDto,
        );
        break;
      case HomePageTypeEnum.PRODUCT:
        resultObj = await this.processProduct(
          parseObj.priority,
          parseObj.content as ProductContentDto,
        );
        break;
      case HomePageTypeEnum.CATEGORY:
        resultObj = await this.processCategory(
          parseObj.priority,
          parseObj.content as CategoryContentDto,
        );
        break;
      case HomePageTypeEnum.SLIDER:
        resultObj = await this.processSliding(
          parseObj.priority,
          parseObj.content as Array<SliderContentDto>,
        );
        break;
      case HomePageTypeEnum.BANNER:
        resultObj = await this.processBanner(
          parseObj.priority,
          parseObj.content as Array<BannerContentDto>,
        );
        break;
      case HomePageTypeEnum.BRAND:
        resultObj = await this.processBrand(
          parseObj.priority,
          parseObj.content as BrandContentDto,
        );
        break;
      case HomePageTypeEnum.SELECTEDPRODUCT:
        resultObj = await this.processSelectedProduct(
          parseObj.priority,
          parseObj.content as SelectedProductContentDto,
        );
        break;
      default:
        break;
    }
    return resultObj;
  }

  async processBrand(priority: number, input: BrandContentDto) {
    const baseUrl = this.config.get('BASE_URL');
    const frontUrl = this.config.get('BASE_FRONT_URL');
    return {
      priority: priority,
      type: HomePageTypeEnum.BRAND,
      title: input.title,
      link:
        baseUrl +
        `/v1/api/ecommerce/brands?orderBy=priority&sortOrder=DESC&limit=20`,
      totalLink: frontUrl + '/brands',
      requestBased: true,
    };
  }

  async processCategory(priority: number, input: CategoryContentDto) {
    const baseUrl = this.config.get('BASE_URL');
    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.CATEGORY,
      link:
        baseUrl +
        `/v1/api/eav/admin/entityTypes?orderBy=priority&sortOrder=DESC&limit=8`,
      totalLink: null,
      requestBased: true,
    };
  }

  async processSelectedProduct(
    priority: number,
    input: SelectedProductContentDto,
  ) {
    const baseUrl = this.config.get('BASE_URL');
    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.SELECTEDPRODUCT,
      link:
        baseUrl +
        `/v1/api/ecommerce/user/selectedProducts?orderBy=priority&sortOrder=ASC&limit=20`,
      totalLink: null,
      requestBased: true,
    };
  }

  async processProductCategory(
    priority: number,
    input: ProductCategoryContentDto,
  ) {
    const baseUrl = this.config.get('BASE_URL');
    const frontUrl = this.config.get('BASE_FRONT_URL');
    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: input.sortBy }).build(),
    );
    if (!sort) {
      throw new InternalServerErrorException('the sort key not founded!');
    }

    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: input.entityTypeId })
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
      throw new InternalServerErrorException('the entityTypeId not founded!');
    }
    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.PRODUCTCATEGORY,
      link:
        baseUrl +
        `/v1/api/ecommerce/products?entityTypeId=${input.entityTypeId}&orderBy=${sort.sortField}&sortOrder=${sort.sortOrder}`,
      totalLink: frontUrl + `/category/${entityType.slug}`,
      requestBased: true,
    };
  }

  async processProductBrand(priority: number, input: ProductBrandContentDto) {
    const baseUrl = this.config.get('BASE_URL');
    const frontUrl = this.config.get('BASE_FRONT_URL');
    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: input.sortBy }).build(),
    );
    if (!sort) {
      throw new InternalServerErrorException('the sort key not founded!');
    }

    const brand = await this.brandRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: input.brandId })
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
      throw new InternalServerErrorException('the brandId not founded!');
    }
    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.PRODUCTBRAND,
      link:
        baseUrl +
        `/v1/api/ecommerce/products?brands=${input.brandId}&orderBy=${sort.sortField}&sortOrder=${sort.sortOrder}`,
      totalLink: frontUrl + `/brand/${brand.slug}`,
      requestBased: true,
    };
  }

  async processAmazing(priority: number, input: AmazingContentDto) {
    const baseUrl = this.config.get('BASE_URL');
    const frontUrl = this.config.get('BASE_FRONT_URL');
    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: input.sortBy }).build(),
    );
    if (!sort) {
      throw new InternalServerErrorException('the sort key not founded!');
    }

    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.AMAZING,
      link:
        baseUrl +
        `/v1/api/ecommerce/products?discountTypeId=${this.amazingTypeId.toString()}&orderBy=${
          sort.sortField
        }&sortOrder=${sort.sortOrder}`,
      totalLink: frontUrl + `/amazing`,
      requestBased: true,
    };
  }

  async processProduct(priority: number, input: ProductContentDto) {
    const baseUrl = this.config.get('BASE_URL');
    const frontUrl = this.config.get('BASE_FRONT_URL');
    const sort = await this.entityTypeSortRepository.findOne(
      new QueryOptionsBuilder().filter({ id: input.sortBy }).build(),
    );
    if (!sort) {
      throw new InternalServerErrorException('the sort key not founded!');
    }

    return {
      priority: priority,
      title: input.title,
      type: HomePageTypeEnum.PRODUCT,
      link:
        baseUrl +
        `/v1/api/ecommerce/products?orderBy=${sort.sortField}&sortOrder=${sort.sortOrder}`,
      totalLink: frontUrl + `/search`,
      requestBased: true,
    };
  }

  async processSliding(priority: number, items: SliderContentDto[]) {
    const minioBaseUrl = this.config.get('MINIO_ENDPOINT');
    const protocol =
      this.config.get('MINIO_SSL') == 'true' ? 'https://' : 'http://';
    const baseImageUrl = protocol + minioBaseUrl;
    const list = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: item.imageAttachmentId })
          .filter({ attachmentTypeId: this.homeAttachmentTypeId })
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
      if (!findAttachment) {
        throw new InternalServerErrorException('cannot find the attachment');
      }

      const findMobileAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: item.mobileImageAttachmentId })
          .filter({ attachmentTypeId: this.homeAttachmentTypeId })
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
      if (!findMobileAttachment) {
        throw new InternalServerErrorException('cannot find the attachment');
      }
      list.push({
        link: item.link,
        alt: item.alt,
        imageUrl: baseImageUrl + `/homepages/${findAttachment.fileName}`,
        mobileImageUrl:
          baseImageUrl + `/homepages/${findMobileAttachment.fileName}`,
      });
    }

    return {
      priority: priority,
      type: HomePageTypeEnum.SLIDER,
      items: list,
      totalLink: null,
      requestBased: false,
    };
  }

  async processBanner(priority: number, items: BannerContentDto[]) {
    const minioBaseUrl = this.config.get('MINIO_ENDPOINT');
    const protocol =
      this.config.get('MINIO_SSL') == 'true' ? 'https://' : 'http://';
    const baseImageUrl = protocol + minioBaseUrl;
    const list = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: item.imageAttachmentId })
          .filter({ attachmentTypeId: this.homeAttachmentTypeId })
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
      if (!findAttachment) {
        throw new InternalServerErrorException('cannot find the attachment');
      }
      list.push({
        link: item.link,
        alt: item.alt,
        imageUrl: baseImageUrl + `/homepages/${findAttachment.fileName}`,
      });
    }

    return {
      priority: priority,
      type: HomePageTypeEnum.BANNER,
      items: list,
      totalLink: null,
      requestBased: false,
    };
  }
}

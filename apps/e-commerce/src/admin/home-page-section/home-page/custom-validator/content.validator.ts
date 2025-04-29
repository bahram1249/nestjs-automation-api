import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customContentValidator', async: true })
@Injectable()
export class CustomContentValidator implements ValidatorConstraintInterface {
  private messages: string[] = [];

  constructor() {}

  async validate(params: any, args: ValidationArguments): Promise<boolean> {
    let flag = false;

    const bannerContent = await this.isBannerContent(params);
    const sliderContent = await this.isSliderContent(params);
    const productCategoryContent = await this.isProductCategoryContent(params);
    const productBrandContent = await this.isProductBrandContent(params);
    const categoryContent = await this.isCategory(params);
    const brandContent = await this.isBrand(params);
    const amazingContent = await this.isAmazingContent(params);
    const productContent = await this.isProductContent(params);
    const selectedProductContent = await this.isSelectedProduct(params);

    if (
      bannerContent ||
      sliderContent ||
      productCategoryContent ||
      productBrandContent ||
      categoryContent ||
      brandContent ||
      amazingContent ||
      productContent ||
      selectedProductContent
    ) {
      flag = true;
    }

    if (!flag) {
      throw new UnprocessableEntityException(
        `${JSON.stringify(params)} is not valid`,
      );
    }

    return flag;
  }

  private async isBannerContent(obj: any) {
    return (
      typeof (obj.alt == 'string' || obj.alt == null) &&
      typeof obj.link == 'string' &&
      typeof obj.imageAttachmentId == 'number'
    );
  }

  private async isSliderContent(obj: any) {
    return (
      typeof (obj.alt == 'string' || obj.alt == null) &&
      typeof obj.link == 'string' &&
      typeof obj.imageAttachmentId == 'number' &&
      typeof obj.mobileImageAttachmentId == 'number'
    );
  }

  private async isProductCategoryContent(obj: any) {
    return (
      typeof obj.title == 'string' &&
      typeof obj.entityTypeId == 'number' &&
      typeof obj.sortBy == 'number'
    );
  }

  private async isProductBrandContent(obj: any) {
    return (
      typeof obj.title == 'string' &&
      typeof obj.brandId == 'number' &&
      typeof obj.sortBy == 'number'
    );
  }

  private async isCategory(obj: any) {
    return typeof obj.title == 'string';
  }

  private async isSelectedProduct(obj: any) {
    return typeof obj.title == 'string';
  }

  private async isBrand(obj: any) {
    return typeof obj.title == 'string';
  }

  private async isAmazingContent(obj: any) {
    return typeof obj.title == 'string' && typeof obj.sortBy == 'number';
  }

  private async isProductContent(obj: any) {
    return typeof obj.title == 'string' && typeof obj.sortBy == 'number';
  }
}

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
    const productContent = await this.isProductCategoryContent(params);
    const productBrandContent = await this.isProductBrandContent(params);
    const categoryContent = await this.isCategory(params);
    const brandContent = await this.isBrand(params);
    const amazingContent = await this.isAmazingContent(params);

    if (
      bannerContent ||
      sliderContent ||
      productContent ||
      productBrandContent ||
      categoryContent ||
      brandContent ||
      amazingContent
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
      typeof obj.imageAttachmentId == 'number'
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

  private async isBrand(obj: any) {
    return typeof obj.title == 'string';
  }

  private async isAmazingContent(obj: any) {
    return typeof obj.title == 'string' && typeof obj.sortBy == 'number';
  }
}

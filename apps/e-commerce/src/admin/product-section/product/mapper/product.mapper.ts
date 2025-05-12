import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ProductDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECProduct } from '@rahino/localdatabase/models';
import { ProductAttributeDto } from '../dto/product-attribute.dto';
import { EntityAttributeValueDto } from '@rahino/eav/admin/entity-attribute-value/dto';
import { ProductAttachmentDto } from '../dto/product-attachment.dto';
import { PhotoDto } from '@rahino/ecommerce/admin/product-section/product-photo/dto';
import { VideoDto } from '@rahino/ecommerce/admin/product-section/product-video/dto';

@Injectable()
export class ProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        ProductDto,
        ECProduct,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(mapper, ProductAttributeDto, EntityAttributeValueDto);

      createMap(mapper, ProductAttachmentDto, PhotoDto);

      createMap(mapper, ProductAttachmentDto, VideoDto);
    };
  }
}

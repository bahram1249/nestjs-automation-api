import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { PostDto, GetPostDto } from './dto';
import { EAVPost, EAVBlogPublish, EAVEntityType } from '@rahino/database';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(EAVPost)
    private readonly repository: typeof EAVPost,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(filter: GetPostDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder
      .filter({
        [Op.or]: [
          {
            title: {
              [Op.like]: filter.search,
            },
          },
          {
            slug: {
              [Op.like]: filter.search,
            },
          },
        ],
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(builder.build());
    builder = builder
      .attributes([
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ])
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          required: false,
        },
        {
          model: EAVBlogPublish,
          as: 'publish',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(builder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(id: bigint) {
    let builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ])
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          required: false,
        },
        {
          model: EAVBlogPublish,
          as: 'publish',
        },
      ])
      .filter({
        id: id,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const blog = await this.repository.findOne(builder.build());
    if (!blog) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return {
      result: blog,
    };
  }

  async create(dto: PostDto) {
    const slugItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugItem) {
      throw new ForbiddenException(
        this.i18n.t('core.the_given_slug_is_exists_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, PostDto, EAVPost);
    const blog = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );

    return {
      result: _.pick(blog, [
        'id',
        'title',
        'description',
        'publishId',
        'entityTypeId',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ]),
    };
  }

  async updateById(id: bigint, dto: PostDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const slugItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );
    if (slugItem) {
      throw new BadRequestException(
        this.i18n.t('core.the_given_slug_is_exists_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, PostDto, EAVPost);
    const post = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );

    return {
      result: _.pick(post, [
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ]),
    };
  }

  async deleteById(postId: bigint) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: postId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.isDeleted = true;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ]),
    };
  }
}

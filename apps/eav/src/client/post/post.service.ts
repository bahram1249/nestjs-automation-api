import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EAVPost } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(EAVPost) private readonly repository: typeof EAVPost,
  ) {}

  async findBySlug(slug: string) {
    throw new Error('Method not implemented.');
  }
  async findAll(filter: ListFilter) {
    throw new Error('Method not implemented.');
  }
}

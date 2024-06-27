import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { CommentStatusDto } from './comment-status.dto';

export class GetProductCommentDto extends IntersectionType(
  ListFilter,
  CommentStatusDto,
) {}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { CommentService } from './comment.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { OptionalSessionGuard } from '../session/guard';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('Addresses')
@UseGuards(JwtGuard, OptionalSessionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/comments',
  version: ['1'],
})
export class CommentController {
  constructor(private service: CommentService) {}

  // public url
  @ApiOperation({ description: 'show all comments' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }
}

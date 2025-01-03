import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ConfirmCommentDto, GetProductCommentDto } from './dto';
import { ProductCommentService } from './product-comment.service';

@ApiTags('Product-Comment-Admin')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/productComments',
  version: ['1'],
})
export class ProductCommentController {
  constructor(private readonly service: ProductCommentService) {}

  @ApiOperation({ description: 'show all product comments' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcomments.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductCommentDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetProductCommentDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show postage orders by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcomments.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({ description: 'confirm comment by id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcomments.confirmcomment',
  })
  @Patch('/confirmComment/:id')
  @HttpCode(HttpStatus.OK)
  async confirmComment(
    @Param('id') commentId: bigint,
    @GetUser() user: User,
    @Body() dto: ConfirmCommentDto,
  ) {
    return await this.service.confirmComment(commentId, user, dto);
  }

  @ApiOperation({ description: 'reject comment by id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcomments.rejectcomment',
  })
  @Patch('/rejectComment/:id')
  @HttpCode(HttpStatus.OK)
  async rejectComment(
    @Param('id') commentId: bigint,
    @GetUser() user: User,
    //@Body() dto: ConfirmCommentDto,
  ) {
    return await this.service.rejectComment(commentId, user);
  }
}

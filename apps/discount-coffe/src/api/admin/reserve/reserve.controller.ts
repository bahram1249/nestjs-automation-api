import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth/guard';
import { ListFilter } from '@rahino/query-filter';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { ReserveService } from './reserve.service';

@ApiTags('DiscountCoffe-Reserves')
@ApiBearerAuth()
@Controller({
  path: '/api/discountcoffe/admin/reserves',
  version: ['1'],
})
export class ReserveController {
  constructor(private service: ReserveService) {}
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all total reserves' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.reserves.getall',
  })
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

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show reserve by given id' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.reserves.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'update buffets' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.reserves.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async edit(@Param('id') id: bigint, @GetUser() user: User) {
    return await this.service.edit(id, user);
  }
}

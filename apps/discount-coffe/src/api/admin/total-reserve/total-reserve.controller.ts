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
import { JwtGuard } from '@rahino/auth';
import { ListFilter } from '@rahino/query-filter';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { TotalReserveService } from './total-reserve.service';

@ApiTags('DiscountCoffe-TotalReserves')
@ApiBearerAuth()
@Controller({
  path: '/api/discountcoffe/admin/totalreserves',
  version: ['1'],
})
export class TotalReserveController {
  constructor(private service: TotalReserveService) {}
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all total reserves' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.totalreserves.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show reserve by given id' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.totalreserves.getone',
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
    permissionSymbol: 'discountcoffe.admin.totalreserves.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async edit(@Param('id') id: bigint, @GetUser() user: User) {
    return await this.service.edit(id, user);
  }
}

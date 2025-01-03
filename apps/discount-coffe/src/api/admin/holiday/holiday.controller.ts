import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { HolidayService } from './holiday.service';
import { HolidayDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('DiscountCoffe-Holiday')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/discountcoffe/admin/holidays',
  version: ['1'],
})
export class HolidayController {
  constructor(private service: HolidayService) {}

  @ApiOperation({ description: 'get all holidays' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.holidays.showmenu',
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

  @ApiOperation({ description: 'create holidays' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.holidays.showmenu',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: HolidayDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'remove holidays' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.holidays.showmenu',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  async removeById(@GetUser() user: User, @Param('id') id: bigint) {
    return await this.service.remove(user, id);
  }
}

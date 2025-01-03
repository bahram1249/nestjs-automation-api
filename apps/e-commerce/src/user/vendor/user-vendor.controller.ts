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
import { UserVendorService } from './user-vendor.service';
import { JwtGuard } from '@rahino/auth';
import { ListFilter } from '@rahino/query-filter';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('UserVendors')
@Controller({
  path: '/api/ecommerce/user/vendors',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class UserVendorController {
  constructor(private service: UserVendorService) {}

  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @ApiOperation({ description: 'show all vendors that this user is access' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }
}

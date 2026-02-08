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
import { ApiJsonResponse } from '@rahino/response';
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
import { UserVendorResponseDto } from './dto';

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
  @ApiJsonResponse({ type: UserVendorResponseDto, isArray: true })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }
}

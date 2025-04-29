import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { HomePageService } from './home-page.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { HomePageDto } from './dto/home-page.dto';

@ApiTags('Admin-HomePages')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/homePages',
  version: ['1'],
})
export class HomePageController {
  constructor(private service: HomePageService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.homepages.getall' })
  @ApiOperation({ description: 'return all record of home page settings' })
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
  @ApiOperation({ description: 'create home page settings by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.homepages.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: HomePageDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }
}

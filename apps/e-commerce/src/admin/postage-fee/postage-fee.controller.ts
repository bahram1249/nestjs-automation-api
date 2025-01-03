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
import { PostageFeeService } from './postage-fee.service';
import { JwtGuard } from '@rahino/auth';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ListFilter } from '@rahino/query-filter';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { updateAllProvincePriceDto } from './dto';

@ApiTags('Admin-PostageFee')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/postageFees',
})
export class PostageFeeController {
  constructor(private readonly service: PostageFeeService) {}

  @ApiOperation({ description: 'show all postagefees' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.postagefees.getall' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter, @GetUser() user: User) {
    return await this.service.findAll(user, filter);
  }

  @Patch('/allProvincePrice/:id')
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.postagefees.updateAllProvincePrice',
  })
  @HttpCode(HttpStatus.OK)
  async updateAllProvincePrice(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: updateAllProvincePriceDto,
  ) {
    return await this.service.updateAllProvincePrice(id, user, dto);
  }
}

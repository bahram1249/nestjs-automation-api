import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { DiscountCodeService } from './discount-code.service';
import { GetDiscountCodeDto, DiscountCodeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-DiscountCode')
@Controller({
  path: '/api/guarantee/admin/discountCodes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountCodeController {
  constructor(private service: DiscountCodeService) {}

  @ApiOperation({ description: 'show all discount codes' })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountCodeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetDiscountCodeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show discount code by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create discount code' })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DiscountCodeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update discount code by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: bigint, @Body() dto: DiscountCodeDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete discount code by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

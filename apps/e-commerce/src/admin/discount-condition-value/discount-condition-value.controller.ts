import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConditionValueResInterface,
  ConditionValueSourceInterface,
} from './provider/interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetConditionValueDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { DISCOUNT_CONDITION_VALUE_PROVIDER_TOKEN } from './provider/discount-condition-value.constants';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';

@ApiTags('Admin-DiscountConditionValues')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/discountConditionValues',
  version: ['1'],
})
export class DiscountConditionValueController {
  constructor(
    @Inject(DISCOUNT_CONDITION_VALUE_PROVIDER_TOKEN)
    private readonly service: ConditionValueSourceInterface,
  ) {}

  @ApiOperation({
    description: 'show all discount condition values based conditionTypeId',
  })
  @ApiQuery({
    name: 'filter',
    type: GetConditionValueDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.discounts.create' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetConditionValueDto,
  ): Promise<ConditionValueResInterface> {
    return await this.service.findAll(user, filter);
  }
}

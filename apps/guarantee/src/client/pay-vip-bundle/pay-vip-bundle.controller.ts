import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { PayVipBundleService } from './pay-vip-bundle.service';
import { PayVipBundleDto, VipBundleDto } from './dto';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { DiscountCodePreviewResultDto } from '@rahino/guarantee/shared/discount-code/dto';

@ApiTags('GS-PayVipBundle')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/payVipBundles',
  version: ['1'],
})
export class PayVipBundleController {
  constructor(private service: PayVipBundleService) {}

  @Post('/preview')
  @ApiOperation({ description: 'Preview pricing with discount code' })
  async preview(
    @GetUser() user: User,
    @Body() dto: VipBundleDto,
  ): Promise<{ result: DiscountCodePreviewResultDto }> {
    return await this.service.preview(
      user,
      dto.vipBundleTypeId,
      dto.discountCode,
    );
  }

  @ApiOperation({ description: 'create pay vip bundle types by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: PayVipBundleDto) {
    return await this.service.create(user, dto);
  }
}

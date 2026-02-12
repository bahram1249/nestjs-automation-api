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
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { PayVipBundleService } from './pay-vip-bundle.service';
import {
  PayVipBundleDto,
  VipBundleDto,
  GuaranteeClientPayVipBundlePreviewResponseDto,
  GuaranteeClientPayVipBundleCreateResponseDto,
} from './dto';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';

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
  @ApiJsonResponse({
    type: GuaranteeClientPayVipBundlePreviewResponseDto,
    description: 'Vip bundle preview retrieved successfully',
  })
  async preview(@GetUser() user: User, @Body() dto: VipBundleDto) {
    return await this.service.preview(
      user,
      dto.vipBundleTypeId,
      dto.discountCode,
    );
  }

  @ApiOperation({ description: 'create pay vip bundle types by user' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeClientPayVipBundleCreateResponseDto,
    status: 201,
    description: 'Pay vip bundle created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: PayVipBundleDto) {
    return await this.service.create(user, dto);
  }
}

import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { DiscountCodeService } from './discount-code.service';
import { ValidateDiscountCodeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-DiscountCode')
@Controller({
  path: '/api/guarantee/admin/discountCodes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountCodePreviewController {
  constructor(private service: DiscountCodeService) {}

  @ApiOperation({
    description: 'validate discount code for VIP bundle purchase',
  })
  @CheckPermission({ permissionSymbol: 'gs.admin.discountcodes.validate' })
  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  async validateDiscountCode(@Body() dto: ValidateDiscountCodeDto) {
    //return await this.service.validateDiscountCodeForVipBundle(dto);
  }
}

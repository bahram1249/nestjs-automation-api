import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { QrScanDto } from './dto';
import { QrScanService } from './qrscan.service';

@ApiTags('DiscountCoffe-QRScan')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/discountcoffe/admin/qrscans',
  version: ['1'],
})
export class QrScanController {
  constructor(private service: QrScanService) {}

  @ApiOperation({ description: 'confirm reserve' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.qrscan.showmenu',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async confirmReserve(@GetUser() user: User, @Body() dto: QrScanDto) {
    return await this.service.confirmReserve(user, dto);
  }
}

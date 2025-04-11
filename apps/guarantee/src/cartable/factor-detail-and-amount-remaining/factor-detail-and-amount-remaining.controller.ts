import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { GSFactorDeatilAndRemainingAmountService } from './factor-detail-and-amount-remaining.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-FactorRemainingAmount')
@Controller({
  path: '/api/guarantee/cartable/factorDetailAndRemainingAmount',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GsFactorDetailAndReaminingAmountController {
  constructor(private service: GSFactorDeatilAndRemainingAmountService) {}

  @ApiOperation({ description: 'find remaining amount for a given request' })
  @Get('/request/:requestId')
  @HttpCode(HttpStatus.OK)
  async findRemainingAmount(@Param('requestId') requestId: bigint) {
    return await this.service.findFactorDeatilAndRemainingAmount(requestId);
  }
}

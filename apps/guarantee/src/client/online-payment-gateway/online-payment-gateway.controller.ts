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
import { JwtGuard } from '@rahino/auth';
import { OnlinePaymentGatewayService } from './online-payment-gateway.service';
import {
  GetOnlinePaymentGatewayDto,
  GuaranteeClientOnlinePaymentGatewayListResponseDto,
} from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Client-OnlinePaymentGateways')
@Controller({
  path: '/api/guarantee/client/onlinePaymentGateways',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class OnlinePaymentGatewayController {
  constructor(private service: OnlinePaymentGatewayService) {}

  @ApiOperation({ description: 'show all online payment gateways' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetOnlinePaymentGatewayDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeClientOnlinePaymentGatewayListResponseDto,
    description: 'List of online payment gateways retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetOnlinePaymentGatewayDto) {
    return await this.service.findAll(filter);
  }
}

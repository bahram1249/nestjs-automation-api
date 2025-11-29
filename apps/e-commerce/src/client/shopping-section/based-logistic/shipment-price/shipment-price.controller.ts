import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetUser, JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ClientShipmentPriceService } from './shipment-price.service';
import {
  SelectionsShipmentPriceInput,
  SelectionsShipmentPriceResult,
} from './dto/shipment-price.dto';
import { User } from '@rahino/database';

@ApiTags('Client Shipment Price')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/shipmentPrice',
  version: ['1'],
})
export class ClientShipmentPriceController {
  constructor(private readonly service: ClientShipmentPriceService) {}

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({
    description:
      'Calculate shipping for frontend-provided grouped selections (pre-payment validation)',
  })
  @Post('/selections')
  @HttpCode(HttpStatus.OK)
  async priceBySelections(
    @GetECSession() _session: ECUserSession,
    @Body() body: SelectionsShipmentPriceInput,
    @GetUser() _user: User,
  ): Promise<SelectionsShipmentPriceResult> {
    const addressId =
      body.addressId != null ? BigInt(body.addressId) : undefined;
    // couponCode is ignored here because discount logic is handled inside services based on current rules
    return this.service.calSelections(body.groups || [], addressId);
  }
}

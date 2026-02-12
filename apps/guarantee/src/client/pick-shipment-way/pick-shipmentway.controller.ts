import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import {
  PickShipmentWayDto,
  GuaranteeClientPickShipmentWayResponseDto,
} from './dto';
import { User } from '@rahino/database';
import { PickShipmentWayService } from './pick-shipmentway.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientPickShipmentway')
@Controller({
  path: '/api/guarantee/client/pickShipmentway',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickShipmentWayController {
  constructor(private service: PickShipmentWayService) {}

  @ApiOperation({ description: 'pick client shipmentway request' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeClientPickShipmentWayResponseDto,
    description: 'Shipment way picked successfully',
  })
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickShipmentWayDto) {
    return await this.service.traverse(user, dto);
  }
}

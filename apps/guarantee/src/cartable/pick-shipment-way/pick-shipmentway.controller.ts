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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { PickShipmentWayDto } from './dto';
import { User } from '@rahino/database';
import { PickShipmentWayService } from './pick-shipmentway.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-CartablePickShipmentway')
@Controller({
  path: '/api/guarantee/cartable/pickShipmentway',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickShipmentWayController {
  constructor(private service: PickShipmentWayService) {}

  @ApiOperation({ description: 'pick client shipmentway request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickShipmentWayDto) {
    return await this.service.traverse(user, dto);
  }
}

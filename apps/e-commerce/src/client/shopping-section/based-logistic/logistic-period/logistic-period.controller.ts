import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { LogisticPeriodService } from './logistic-period.service';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';

@ApiTags('Client Logistic Periods')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/logisticPeriods',
  version: ['1'],
})
export class LogisticPeriodController {
  constructor(private readonly service: LogisticPeriodService) {}

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'show all logistic periods' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetECSession() session: ECUserSession) {
    return await this.service.getDeliveryOptions(session, 8);
  }
}

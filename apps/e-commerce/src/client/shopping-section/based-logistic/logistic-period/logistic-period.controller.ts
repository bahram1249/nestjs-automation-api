import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { LogisticPeriodService } from './logistic-period.service';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ClientLogisticPeriodDto } from './dto';
import { User } from '@rahino/database';

@ApiTags('Client Logistic Periods')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/logisticPeriods',
  version: ['1'],
})
export class LogisticPeriodController {
  constructor(private readonly service: LogisticPeriodService) {}

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'show all logistic periods' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetECSession() session: ECUserSession,
    @Body() dto: ClientLogisticPeriodDto,
    @GetUser() user: User,
  ) {
    return await this.service.getDeliveryOptions(user, session, dto);
  }
}

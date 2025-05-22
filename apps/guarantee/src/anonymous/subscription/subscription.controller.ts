import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dto';

@ApiTags('GS-Anonymous-Subscription')
@Controller({
  path: '/api/guarantee/anonymous/subscriptions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubscriptionController {
  constructor(private service: SubscriptionService) {}

  @ApiOperation({ description: 'joined to subscription' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SubscriptionDto) {
    return await this.service.create(dto);
  }
}

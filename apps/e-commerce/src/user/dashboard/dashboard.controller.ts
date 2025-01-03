import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { DashboardService } from './dashboard.service';

@ApiTags('User-Dashboards')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/dashboards',
  version: ['1'],
})
export class DashaboardController {
  constructor(private readonly service: DashboardService) {}

  @ApiOperation({ description: 'show total order of current user' })
  @Get('/totalOrders')
  @HttpCode(HttpStatus.OK)
  async totalOrders(@GetUser() user: User) {
    return await this.service.totalOrders(user);
  }

  @ApiOperation({ description: 'show total comments of current user' })
  @Get('/totalComments')
  @HttpCode(HttpStatus.OK)
  async totalComments(@GetUser() user: User) {
    return await this.service.totalComments(user);
  }

  @ApiOperation({ description: 'show total wallet amounts of current user' })
  @Get('/totalWalletAmounts')
  @HttpCode(HttpStatus.OK)
  async totalWalletAmounts(@GetUser() user: User) {
    return await this.service.totalWalletAmounts(user);
  }
}

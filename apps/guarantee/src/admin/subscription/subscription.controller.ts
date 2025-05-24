import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { SubscriptionService } from './subscription.service';
import { GetSubscriptionDto } from './dto';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-Subscription')
@Controller({
  path: '/api/guarantee/admin/subscriptions',
  version: ['1'],
})
export class SubscriptionController {
  constructor(private service: SubscriptionService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all subscriptions' })
  @CheckPermission({ permissionSymbol: 'gs.admin.subscriptions.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSubscriptionDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSubscriptionDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'download excel files' })
  @CheckPermission({ permissionSymbol: 'gs.admin.subscriptions.getall' })
  @Get('/excel')
  @HttpCode(HttpStatus.OK)
  async downloadExcel(@Res() res: Response) {
    return await this.service.downloadExcel(res);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show subscription by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.subscriptions.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogisticWeeklyPeriodService } from './logistic-weekly-period.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { LogisticWeeklyPeriodDto, GetLogistiWeeklyPeriodDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Admin-LogisticWeeklyPeriod')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/logisticWeeklyPeriods',
})
export class LogisticWeeklyPeriodController {
  constructor(private readonly service: LogisticWeeklyPeriodService) {}

  // public url
  @ApiOperation({ description: 'show all logistic weekly periods' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetLogistiWeeklyPeriodDto,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticweeklyperiods.getall',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetLogistiWeeklyPeriodDto,
    @GetUser() user: User,
  ) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show logistic weekly period by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticweeklyperiods.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({ description: 'create logistic weekly period by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.logisticweeklyperiods.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: LogisticWeeklyPeriodDto) {
    return await this.service.create(user, dto);
  }
}

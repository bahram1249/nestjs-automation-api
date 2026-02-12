import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
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
import { GetUser, JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';
import { TrackingRequestService } from './tracking-request.service';
import { User } from '@rahino/database';
import {
  GetTrackingRequestExternalDto,
  GuaranteeAdminTrackingRequestListResponseDto,
  GuaranteeAdminTrackingRequestCurrentStateListResponseDto,
} from './dto';
import { RequestCurrentStateFilterDto } from '@rahino/guarantee/shared/cartable-filtering/dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-TrackingRequests')
@Controller({
  path: '/api/guarantee/admin/trackingRequests',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class TrackingRequestController {
  constructor(private service: TrackingRequestService) {}

  @ApiOperation({ description: 'show all tracking requests' })
  @CheckPermission({ permissionSymbol: 'gs.admin.trackingrequests.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetTrackingRequestExternalDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({ type: GuaranteeAdminTrackingRequestListResponseDto })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetTrackingRequestExternalDto,
  ) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'get current states of request' })
  @CheckPermission({ permissionSymbol: 'gs.admin.trackingrequests.getall' })
  @Get('/currentState')
  @ApiQuery({
    name: 'filter',
    type: RequestCurrentStateFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeAdminTrackingRequestCurrentStateListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findCurrentStates(
    @GetUser() user: User,
    @Query() filter: RequestCurrentStateFilterDto,
  ) {
    return await this.service.findCurrentStates(user, filter);
  }
}

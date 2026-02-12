import { Controller, UseGuards, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@rahino/database';
import { AllActivitiesService } from './all-activities.service';
import { GetUser, JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { GuaranteeCartableAllActivitiesResponseDto } from './dto';

@UseGuards(JwtGuard)
@ApiTags('GS-AllActivities')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/cartable/allActivities',
  version: ['1'],
})
export class AllActivitiesController {
  constructor(private readonly allActivitiesService: AllActivitiesService) {}

  @ApiOperation({ summary: 'Get all activities' })
  @ApiJsonResponse({ type: GuaranteeCartableAllActivitiesResponseDto })
  @Get('/')
  async findAll(@GetUser() user: User) {
    return await this.allActivitiesService.findAll(user);
  }
}

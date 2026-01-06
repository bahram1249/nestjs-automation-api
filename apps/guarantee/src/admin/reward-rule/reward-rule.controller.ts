import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { JwtGuard } from '@rahino/auth';
import { RewardRuleService } from './reward-rule.service';
import { GetRewardRuleDto, RewardRuleDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-RewardRule')
@Controller({
  path: '/api/guarantee/admin/rewardRules',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RewardRuleController {
  constructor(private service: RewardRuleService) {}

  @ApiOperation({ description: 'show all reward rules' })
  @CheckPermission({ permissionSymbol: 'gs.admin.rewardrules.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetRewardRuleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetRewardRuleDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show reward rule by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.rewardrules.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create reward rule' })
  @CheckPermission({ permissionSymbol: 'gs.admin.rewardrules.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: RewardRuleDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'delete reward rule by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.rewardrules.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

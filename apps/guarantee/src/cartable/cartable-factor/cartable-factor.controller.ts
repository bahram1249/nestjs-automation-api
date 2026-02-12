import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { FactorService } from './cartable-factor.service';
import {
  GetFactorDto,
  GuaranteeCartableFactorListResponseDto,
  GuaranteeCartableFactorResponseDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';

@ApiTags('GS-Cartable-Factor')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/cartable/factors',
  version: ['1'],
})
export class FactorController {
  constructor(private service: FactorService) {}

  // public url
  @ApiOperation({ description: 'show all cartable factors' })
  @CheckPermission({ permissionSymbol: 'gs.admin.factors.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetFactorDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({ type: GuaranteeCartableFactorListResponseDto })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetFactorDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show factor by given id' })
  @Get('/:id')
  @CheckPermission({ permissionSymbol: 'gs.admin.factors.getone' })
  @ApiJsonResponse({ type: GuaranteeCartableFactorResponseDto })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }
}

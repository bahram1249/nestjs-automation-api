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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { ResponseService } from './response.service';
import { GetResponseDto, GuaranteeAdminResponseDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Responses')
@Controller({
  path: '/api/guarantee/admin/responses',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GSResponseController {
  constructor(private service: ResponseService) {}

  @ApiOperation({ description: 'show all response' })
  @CheckPermission({ permissionSymbol: 'gs.admin.response.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetResponseDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeAdminResponseDto,
    isArray: true,
    description: 'List of responses retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetResponseDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show response by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.response.getone' })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminResponseDto,
    description: 'Response retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}

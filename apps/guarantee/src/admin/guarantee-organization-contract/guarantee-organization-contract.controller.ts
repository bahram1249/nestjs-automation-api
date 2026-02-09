import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { GuaranteeOrganizationContractService } from './guarantee-organization-contract.service';
import {
  GetGuaranteeOrganizationContractDto,
  GuaranteeOrganizationContractDto,
  GuaranteeAdminGuaranteeOrganizationContractResponseDto,
} from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-GuaranteeOrganizationContract')
@Controller({
  path: '/api/guarantee/admin/guaranteeOrganizationContracts',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GuaranteeOrganizationContractController {
  constructor(private service: GuaranteeOrganizationContractService) {}

  @ApiOperation({ description: 'show all guarantee organization contracts' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizationcontracts.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetGuaranteeOrganizationContractDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeAdminGuaranteeOrganizationContractResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetGuaranteeOrganizationContractDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show guarantee organization by given id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizationcontracts.getone',
  })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminGuaranteeOrganizationContractResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create guarantee organization contract' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizationcontracts.create',
  })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeAdminGuaranteeOrganizationContractResponseDto,
    status: 201,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: GuaranteeOrganizationContractDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({
    description: 'update guarantee organization contract by given id',
  })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizationcontracts.update',
  })
  @Put('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminGuaranteeOrganizationContractResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id') id: bigint,
    @Body() dto: GuaranteeOrganizationContractDto,
  ) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete guarantee organization contract by id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizationcontracts.delete',
  })
  @Delete('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminGuaranteeOrganizationContractResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}

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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { GuaranteeOrganizationService } from './guarantee-organization.service';
import { GetGuaranteeOrganizationDto, GuaranteeOrganizationDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-GuaranteeOrganization')
@Controller({
  path: '/api/guarantee/admin/guaranteeOrganizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GuaranteeOrganizationController {
  constructor(private service: GuaranteeOrganizationService) {}

  @ApiOperation({ description: 'show all guarantee organizations' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizations.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetGuaranteeOrganizationDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetGuaranteeOrganizationDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show guarantee organization by given id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizations.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create guarantee organization' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizations.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: GuaranteeOrganizationDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update guarantee organization by given id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizations.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id') id: number,
    @Body() dto: GuaranteeOrganizationDto,
  ) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete guarantee by id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.guaranteeorganizations.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
